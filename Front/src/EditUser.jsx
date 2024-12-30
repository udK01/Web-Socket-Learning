import React from "react";

const EditUser = ({
  userID,
  setUserID,
  profilePicture,
  setProfilePicture,
  setEdit,
}) => {
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserIDChange = (e) => {
    setUserID(e.target.value);
  };

  const handleSubmit = () => {
    setEdit(false);
    console.log("Updated userID:", userID);
    console.log("Updated profile picture:", profilePicture);
  };

  return (
    <div className="w-full h-full absolute flex justify-center items-center">
      <div className="relative w-[20%] h-[30%] bg-purple-600 bg-opacity-50 ring-4 rounded-md ring-purple-700">
        <button
          className="absolute top-2 right-2 text-white bg-purple-700 hover:bg-purple-800 rounded-full w-8 h-8 flex justify-center items-center"
          onClick={() => setEdit(false)}
        >
          X
        </button>
        <div className="flex flex-col h-full items-center justify-center space-y-3 p-2">
          <img
            src={profilePicture}
            className="w-40 h-40 hover:cursor-pointer hover:bg-purple-800 rounded-full object-cover"
            alt="Profile"
            onClick={() =>
              document.getElementById("profilePictureInput").click()
            }
          />
          <input
            id="profilePictureInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePictureChange}
          />
          <input
            value={userID}
            onChange={handleUserIDChange}
            placeholder="Enter user ID"
            className="w-[90%] bg-transparent text-center"
          />
          <button
            className="text-white rounded-md ring-2 ring-purple-900 bg-purple-800 px-6 py-1 hover:bg-purple-900 hover:ring-purple-950"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
