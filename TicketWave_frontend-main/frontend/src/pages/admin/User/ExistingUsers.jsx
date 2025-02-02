import LayOut from "@/components/LayOut";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserDetailsPopup({ user, onClose }) {
  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col items-center space-y-4 px-5 py-10">
          <div className="flex justify-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-5">
              <h2 className="text-xl font-bold">{user.username}</h2>
              <p className="text-sm">{user.name}</p>
              <p className="text-sm">{user.phoneNumber}</p>
            </div>
          </div>
          <div className="w-full space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">UserID</span>
              <span>{user.userId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Department</span>
              <span>{user.departmentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Designation</span>
              <span>{user.designation}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ExistingUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_DOMAIN}/user-profiles`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
        console.log("Fetched users:", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        toast.error("Failed to fetch users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    navigate(`/edit-user/${user.userId}`); // Navigate to edit user page
  };

  const handleRowClick = (user) => {
    setSelectedUser(user); // Show user details popup
  };

  const handleDeleteClick = async (user) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_DOMAIN}/delete-user/${user.userId}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      if (response.status === 200) {
        // Refresh the user list after deletion
        const updatedUsers = users.filter((u) => u.userId !== user.userId);
        setUsers(updatedUsers);
        toast.success("User deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  return (
    <LayOut>
      <div className="p-6 bg-white dark:bg-dark3 rounded-lg shadow-md ml-80 mr-10 my-40">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800 dark:text-light1">
            Existing Users
          </h1>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-dark2">
              <TableHead className="w-[100px]">User ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center ">
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Loading Users
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow
                  key={user.userId}
                  onClick={() => handleRowClick(user)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.avatar || ""}
                          alt={user.username || "User"}
                        />
                        <AvatarFallback>
                          {(user.username && user.username[0].toUpperCase()) ||
                            "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.userId || "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.username || "N/A"}</TableCell>
                  <TableCell>{user.designation || "N/A"}</TableCell>
                  <TableCell>{user.departmentId || "N/A"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click from triggering
                            handleEditClick(user);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click from triggering
                            handleDeleteClick(user);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <UserDetailsPopup
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />

        {/* Add ToastContainer to display notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </LayOut>
  );
}
