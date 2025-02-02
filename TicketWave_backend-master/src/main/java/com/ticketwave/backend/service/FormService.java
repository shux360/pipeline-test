package com.ticketwave.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ticketwave.backend.model.form.*;
import com.ticketwave.backend.repository.FormDetailRepo;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class FormService {

    @PersistenceContext
    private EntityManager entityManager;
    @Autowired
    private FormDetailRepo repository;

    @Autowired
    private ObjectMapper objectMapper;

    public Optional<FormDTO> getFormDetailByRequestId(Long requestId) {
        Optional<FormDetail> formDetail = repository.findByRequestId(requestId);
        return formDetail.map(this::convertToDTO);
    }

    private FormDTO convertToDTO(FormDetail formDetail) {
        FormDTO formDTO = new FormDTO();
        formDTO.setRequestId(formDetail.getRequestId().toString());
        formDTO.setElements(convertElementsToDTO(formDetail.getElements()));
        return formDTO;
    }

    private List<FormElementDTO> convertElementsToDTO(List<FormElement> elements) {
        return elements.stream()
                .map(this::convertElementToDTO)
                .collect(Collectors.toList());
    }

    private FormElementDTO convertElementToDTO(FormElement formElement) {
        FormElementDTO elementDTO = new FormElementDTO();
        elementDTO.setId(formElement.getId());
        elementDTO.setType(formElement.getType());
        elementDTO.setLabel(formElement.getLabel());
        elementDTO.setPlaceholder(formElement.getPlaceholder());
        elementDTO.setRequired(formElement.isRequired());
        elementDTO.setOptions(convertOptionsToDTO(formElement.getOptions()));
        elementDTO.setAccept(formElement.getAccept());
        elementDTO.setOrder(formElement.getOrder());
        return elementDTO;
    }

    private List<OptionDTO> convertOptionsToDTO(List<FormElementOption> options) {
        return options.stream()
                .map(option -> new OptionDTO(option.getOptionValue()))
                .collect(Collectors.toList());
    }

    public FormDetail saveForm(FormDTO formDTO) {
        // Map FormDTO to FormDetail entity
        FormDetail formDetail = new FormDetail();
        formDetail.setRequestId(Long.valueOf(formDTO.getRequestId()));

        for (FormElementDTO elementDTO : formDTO.getElements()) {
            FormElement formElement = new FormElement();
            formElement.setType(elementDTO.getType());
            formElement.setLabel(elementDTO.getLabel());
            formElement.setPlaceholder(elementDTO.getPlaceholder());
            formElement.setRequired(elementDTO.isRequired());
            formElement.setOrder(elementDTO.getOrder());

            // Save the form element first to get its ID
            formDetail.addElement(formElement);
        }

        // Save formDetail first to get IDs
        FormDetail savedFormDetail = repository.save(formDetail);

        // Now handle options after we have the form element IDs
        for (int i = 0; i < formDTO.getElements().size(); i++) {
            FormElementDTO elementDTO = formDTO.getElements().get(i);
            FormElement savedElement = savedFormDetail.getElements().get(i);

            if (elementDTO.getOptions() != null && !elementDTO.getOptions().isEmpty()) {
                for (com.ticketwave.backend.model.form.OptionDTO OptionDTO : elementDTO.getOptions()) {
                    savedElement.addOption(OptionDTO.getOptionValue());
                }
            }
        }

        // Save again to persist options
        repository.save(savedFormDetail);
        return savedFormDetail;
    }

    @Transactional
    public FormDetail updateForm(FormDTO formDTO) {
        // Fetch the existing form detail from the database
        Optional<FormDetail> existingFormDetailOpt = repository.findByRequestId(Long.valueOf(formDTO.getRequestId()));
        if (!existingFormDetailOpt.isPresent()) {
            throw new RuntimeException("Form not found for request ID: " + formDTO.getRequestId());
        }

        FormDetail existingFormDetail = existingFormDetailOpt.get();

        // Update the form elements
        updateFormElements(existingFormDetail, formDTO.getElements());

        // Save the updated form detail
        repository.saveAndFlush(existingFormDetail);
        return existingFormDetail;
    }

    @Transactional
    public void updateFormElements(FormDetail existingFormDetail, List<FormElementDTO> updatedElements) {
        // Create a map of existing elements by their ID for quick lookup
        Map<Long, FormElement> existingElementsMap = existingFormDetail.getElements().stream()
                .collect(Collectors.toMap(FormElement::getId, element -> element));

        // Iterate over the updated elements
        for (FormElementDTO updatedElementDTO : updatedElements) {
            if (updatedElementDTO.getId() != null && existingElementsMap.containsKey(updatedElementDTO.getId())) {
                // Update existing element
                FormElement existingElement = existingElementsMap.get(updatedElementDTO.getId());
                updateFormElement(existingElement, updatedElementDTO);
            } else {
                // Add new element
                FormElement newElement = convertDTOToElement(updatedElementDTO, existingFormDetail);
                existingFormDetail.addElement(newElement);
                entityManager.persist(newElement);

            }
        }

        // Handle deleted elements
        List<Long> updatedElementIds = updatedElements.stream()
                .map(FormElementDTO::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        existingFormDetail.getElements().removeIf(element -> !updatedElementIds.contains(element.getId()));
    }

    private void updateFormElement(FormElement existingElement, FormElementDTO updatedElementDTO) {
        existingElement.setType(updatedElementDTO.getType());
        existingElement.setLabel(updatedElementDTO.getLabel());
        existingElement.setPlaceholder(updatedElementDTO.getPlaceholder());
        existingElement.setRequired(updatedElementDTO.isRequired());
        existingElement.setOrder(updatedElementDTO.getOrder());
        existingElement.setAccept(updatedElementDTO.getAccept());

        // Update options
        updateFormElementOptions(existingElement, updatedElementDTO.getOptions());
    }

    private void updateFormElementOptions(FormElement existingElement, List<OptionDTO> updatedOptions) {
        // Create a map of existing options by their value for quick lookup
        Map<String, FormElementOption> existingOptionsMap = existingElement.getOptions().stream()
                .collect(Collectors.toMap(FormElementOption::getOptionValue, option -> option));

        // Iterate over the updated options
        for (OptionDTO updatedOptionDTO : updatedOptions) {
            if (!existingOptionsMap.containsKey(updatedOptionDTO.getOptionValue())) {
                // Add new option
                existingElement.addOption(updatedOptionDTO.getOptionValue());
            }
        }

        // Handle deleted options
        List<String> updatedOptionValues = updatedOptions.stream()
                .map(OptionDTO::getOptionValue)
                .collect(Collectors.toList());

        existingElement.getOptions().removeIf(option -> !updatedOptionValues.contains(option.getOptionValue()));
    }

    private FormElement convertDTOToElement(FormElementDTO elementDTO, FormDetail formDetail) {
        System.out.println("Converting Element DTO to Entity: " + elementDTO);
        FormElement formElement = new FormElement();
        formElement.setType(elementDTO.getType());
        formElement.setLabel(elementDTO.getLabel());
        formElement.setPlaceholder(elementDTO.getPlaceholder());
        formElement.setRequired(elementDTO.isRequired());
        formElement.setOrder(elementDTO.getOrder());
        formElement.setAccept(elementDTO.getAccept());

        if (elementDTO.getOptions() != null && !elementDTO.getOptions().isEmpty()) {
            for (OptionDTO optionDTO : elementDTO.getOptions()) {
                formElement.addOption(optionDTO.getOptionValue());
            }
        }
        formElement.setFormDetail(formDetail);

        return formElement;
    }

//    public void submitForm(Long requestId, Map<String, Object> formValues) {
//        // Fetch the form details
//        Optional<FormDetail> formDetailOpt = repository.findByRequestId(requestId);
//        if (!formDetailOpt.isPresent()) {
//            throw new RuntimeException("Form not found for request ID: " + requestId);
//        }
//
//        FormDetail formDetail = formDetailOpt.get();
//
//        // Process the form values (e.g., save to the database)
//        // Example: Save form values to a new table or update existing records
//        // This logic depends on your application's requirements.
//
//        // For now, just log the form values
//        System.out.println("Form submitted for request ID: " + requestId);
//        System.out.println("Form values: " + formValues);
//    }

}



//    public FormDetail getForm(Long requestId) {
//        return repository.findByRequestId(requestId)
//                .orElseThrow(() -> new RuntimeException("Form not found"));
//    }

//        List<FormElement> formElements = formDTO.getElements().stream().map(elementDTO -> {
//            FormElement formElement = new FormElement();
//            formElement.setType(elementDTO.getType());
//            formElement.setLabel(elementDTO.getLabel());
//            formElement.setPlaceholder(elementDTO.getPlaceholder());
//            formElement.setRequired(elementDTO.isRequired());
//            formElement.setOrder(elementDTO.getOrder());
//            formElement.setFormDetail(formDetail); // Link element to form
//
//
//            // Map options to FormElementOption
//            List<FormElementOption> options = elementDTO.getOptions().stream().map(optionDTO -> {
//                FormElementOption option = new FormElementOption();
//                FormElementOptionKey key = new FormElementOptionKey();
//                key.setFormElementId(formElement.getId());
//                key.setOptionValue(optionDTO.getId().getOptionValue());
//                option.setId(key);
//                option.setFormElement(formElement);
//                return option;
//            }).toList();
//
//            formElement.setOptions(options);
//            return formElement;
//        }).toList();
//
//        formDetail.setElements(formElements);
//        // Save the form along with elements
//        repository.save(formDetail);
//    }

//    public FormDTO getForm(Long requestId) throws JsonProcessingException {
//        FormDetail entity = repository.findById(requestId)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
//
//        FormDTO dto = new FormDTO();
//        dto.setRequestId(String.valueOf(entity.getRequestId()));
//        dto.setElements(objectMapper.readValue(entity.getElements(),
//                new TypeReference<List<FormElement>>() {}));
//
//        return dto;
//    }
