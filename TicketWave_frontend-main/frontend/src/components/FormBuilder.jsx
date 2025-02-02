import React, { useState, useEffect } from 'react';
import { Trash2, GripVertical, Plus, Eye, Edit2, Save } from 'lucide-react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import Combobox from "@/components/Combobox";
import 'react-datepicker/dist/react-datepicker.css';

const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

const FormBuilder = ({ requestId, urlRequestId, formElements: initialFormElements = [], setFormElements, readOnly = false }) => {
    console.log("urlRequestId:", urlRequestId);
    console.log("requestId:", requestId);
    const [formElements, setFormElementsInternal] = useState(initialFormElements);
    const [draggedItem, setDraggedItem] = useState(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [users, setUsers] = useState([]);

    const elementTypes = [
        { type: 'text', label: 'Text Input' },
        { type: 'textarea', label: 'Text Area' },
        { type: 'select', label: 'Dropdown' },
        { type: 'checkbox', label: 'Checkbox' },
        { type: 'radio', label: 'Radio Button' },
        { type: 'file', label: 'File Upload' },
        { type: 'date picker', label: 'Date Picker' }, 
        { type: 'user assign', label: 'Assign User' } 
    ];

    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json',
    };

    // Add a new form element
    const addElement = (type) => {
        if (!readOnly) {
            const id = Date.now();
            const newElement = {
                id,
                type,
                label: `New ${type} field`,
                placeholder: type === 'file' ? 'Choose a file' : 'Enter value here',
                required: false,
                options: type === 'select' || type === 'radio' ? [{ optionValue: "Option 1" }, { optionValue: "Option 2" }] : [],
                accept: type === 'file' ? '.pdf,.doc,.docx' : undefined,
                startDate: type === 'date picker' ? null : undefined, 
                endDate: type === 'date picker' ? null : undefined,
                assignedUser: type === 'user assign' ? null : undefined 

            };
            const updatedElements = [...formElements, newElement];
            setFormElementsInternal(updatedElements);
            if (setFormElements) setFormElements(updatedElements);
        }
    };

    // Delete a form element
    const deleteElement = (id) => {
        if (!readOnly) {
            const updatedElements = formElements.filter(element => element.id !== id);
            setFormElementsInternal(updatedElements);
            if (setFormElements) setFormElements(updatedElements);
        }
    };

    // Update a form element
    const updateElement = (id, updates) => {
        if (!readOnly) {
            const updatedElements = formElements.map(element =>
                element.id === id ? { ...element, ...updates } : element
            );
            setFormElementsInternal(updatedElements);
            if (setFormElements) setFormElements(updatedElements);
        }
    };

    // Handle drag-and-drop reordering
    const handleDragStart = (e, index) => {
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = 'move';
    };
    useEffect(() => {
        if (!readOnly) {
            fetchUsers();
        }
    }, []);
    
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${backendUrl}/forms/users`, { headers });
            setUsers(response.data);
            console.log("Users:", response.data);
        } catch (error) {
            toast.error('Error fetching users: ' + error.message);
        }
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedItem === null) return;
        const newElements = [...formElements];
        const draggedElement = newElements[draggedItem];
        newElements.splice(draggedItem, 1);
        newElements.splice(index, 0, draggedElement);
        setFormElementsInternal(newElements);
        if (setFormElements) setFormElements(newElements);
        setDraggedItem(index);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    // Save form configuration to the backend
    const saveOrUpdateForm  = async () => {
        try {
            setSaveStatus('Saving...');
            const formConfig = {
                requestId: urlRequestId ? urlRequestId : requestId,
                elements: formElements.map(element => ({
                    ...element,
                    order: formElements.indexOf(element),
                    options: element.type === 'select' || element.type === 'radio'
                        ? element.options.map(option => ( option ))
                        : [],
                    startDate: element.type === 'date picker' ? element.startDate : undefined,
                    endDate: element.type === 'date picker' ? element.endDate : undefined,
                    assignedUser: element.type === 'user assign' ? element.assignedUser : undefined
                }))
            };
            console.log("Form config:", formConfig);
            let response;
            if (urlRequestId) {
                // Update existing form
                response = await axios.put(`${backendUrl}/forms/${urlRequestId}`, formConfig, { headers });
                toast.success('Form updated successfully');
                
            } else {
                // Save new form
                response = await axios.post(`${backendUrl}/forms/save`, formConfig, { headers });
                toast.success('Form saved successfully');
            }

            console.log("Response from backend:", response.data);
        } catch (error) {
            toast.error('Error saving form: ' + error.message);
        } finally {
            setSaveStatus('');
        }
    };

    // Render a form element in preview mode
    const renderPreviewElement = (element) => {
        const { id, type, label, placeholder, required, options, accept,startDate, endDate, assignedUser } = element;
        switch (type) {
            case 'text':
                return <input type="text" placeholder={placeholder} className="w-full p-2 border rounded" required={required} />;
            case 'textarea':
                return <textarea placeholder={placeholder} className="w-full p-2 border rounded" required={required} />;
            case 'select':
                return (
                    <select className="w-full p-2 border rounded" required={required}>
                        <option value="">Select an option</option>
                        {options.map((option, i) => (
                            <option key={i} value={option.optionValue}>{option.optionValue}</option>
                        ))}
                    </select>
                );
            case 'checkbox':
                return (
                    <div className="flex items-center">
                        <input type="checkbox" required={required} className="mr-2" />
                        <span>{placeholder}</span>
                    </div>
                );
            case 'radio':
                return (
                    <div>
                        {options.map((option, i) => (
                            <div key={i} className="flex items-center mb-1">
                                <input type="radio" name={`radio-${id}`} required={required} className="mr-2" />
                                <span>{option.optionValue}</span>
                            </div>
                        ))}
                    </div>
                );
            case 'file':
                return (
                    <input
                        type="file"
                        accept={accept}
                        required={required}
                        className="w-full p-2 border rounded"
                    />
                );
            case 'date picker':
                return (
                    <DatePicker
                        selectsRange
                        placeholderText='Select the date'
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(dates) => updateElement(id, { startDate: dates[0], endDate: dates[1] })}
                        isClearable
                        className="w-full p-2 border rounded"
                    />
                );
            case 'user assign':
                return (
                    <Combobox
                        users={users} // Pass the fetched users
                        className="w-full p-2 border rounded" // Add your desired className
                        value={assignedUser} // Pass the current value
                        onSelect={(selectedUserId) => {
                            updateElement(id, { assignedUser: selectedUserId }); // Update the assignedUser field
                        }}
                        required={required} // Pass the required prop
                    />
                );
            default:
                return null;
        }
    };

    // Render a form element in edit mode
    const renderFormElement = (element, index, isPreview = false) => {
        const { id, type, label, required, options, accept } = element;
        const optionsString = options.map(opt => opt.optionValue).join(', ');
        if (isPreview) {
            return (
                <div key={id} className="mb-4">
                    <label className="block mb-2 font-medium">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderPreviewElement(element)}
                </div>
            );
        }
        return (
            <div
                key={id}
                draggable={!readOnly}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className="flex items-center gap-4 p-4 mb-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
            >
                <div className="cursor-move text-gray-400 hover:text-gray-600">
                    <GripVertical size={20} />
                </div>
                <div className="flex-grow">
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => updateElement(id, { label: e.target.value })}
                        className="mb-2 text-lg font-medium bg-transparent border-none focus:outline-none"
                        disabled={readOnly}
                    />
                    {renderPreviewElement(element)}
                    <div className="mt-2 flex items-center gap-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={required}
                                onChange={(e) => updateElement(id, { required: e.target.checked })}
                                className="mr-1"
                                disabled={readOnly}
                            />
                            <span className="text-sm text-gray-600">Required</span>
                        </div>
                        {(type === 'select' || type === 'radio') && (
                            <input
                            type="text"
                            value={optionsString} 
                            onChange={(e) => {
                                const inputValue = e.target.value; 
                                
                                updateElement(id, { options: [{ optionValue: inputValue }] });
                            }}
                            onBlur={(e) => {
                                
                                const inputValue = e.target.value;
                                const updatedOptions = inputValue
                                    .split(',') 
                                    .map(opt => opt.trim()) 
                                    .filter(Boolean) 
                                    .map(opt => ({ optionValue: opt })); 
                                updateElement(id, { options: updatedOptions });
                            }}
                            placeholder="Options (comma-separated)"
                            className="text-sm p-1 border rounded flex-grow"
                            disabled={readOnly}
                        />
                        )}
                        {type === 'file' && (
                            <input
                                type="text"
                                value={accept}
                                onChange={(e) => updateElement(id, { accept: e.target.value })}
                                placeholder="File types (e.g., .pdf,.doc)"
                                className="text-sm p-1 border rounded"
                                disabled={readOnly}
                            />
                        )}
                    </div>
                </div>
                {!readOnly && (
                    <button
                        onClick={() => deleteElement(id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="flex h-screen gap-6 p-6 bg-gray-50">
            <div className="flex-grow">
                <div className="flex justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold">Form Builder</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {saveStatus && (
                            <span className={`text-sm ${saveStatus.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                                {saveStatus}
                            </span>
                        )}
                        {!readOnly && (
                            <button
                                onClick={saveOrUpdateForm}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                // disabled={!urlRequestId}
                            >
                                <Save size={18} />
                                {urlRequestId ? 'Update' : 'Save'}
                            </button>
                        )}
                        {!readOnly && (
                            <button
                                onClick={() => setIsPreviewMode(!isPreviewMode)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                {isPreviewMode ? <Edit2 size={14} /> : <Eye size={14} />}
                                {isPreviewMode ? 'Edit' : 'Preview'}
                            </button>
                        )}
                    </div>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white h-[calc(102vh-120px)] overflow-y-auto p-6">
                    {isPreviewMode ? (
                        <form onSubmit={(e) => e.preventDefault()} className="max-w-2xl mx-auto">
                            {formElements.map((element, index) => renderFormElement(element, index, true))}
                            {formElements.length > 0 && (
                                <button type="submit" className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                    Submit Form
                                </button>
                            )}
                        </form>
                    ) : (
                        <>
                            {formElements.map((element, index) => renderFormElement(element, index))}
                            {formElements.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    Add form elements using the menu on the right
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            {!readOnly && (
                <div className="w-64 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Form Elements</h3>
                    <div className="space-y-2">
                        {elementTypes.map(({ type, label }) => (
                            <button
                                key={type}
                                onClick={() => addElement(type)}
                                className="flex items-center gap-2 w-full px-4 py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                            >
                                <Plus size={16} />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

FormBuilder.propTypes = {
    requestId: PropTypes.string,
    urlRequestId: PropTypes.string,
    formElements: PropTypes.array,
    setFormElements: PropTypes.func,
    readOnly: PropTypes.bool,
};

export default FormBuilder;