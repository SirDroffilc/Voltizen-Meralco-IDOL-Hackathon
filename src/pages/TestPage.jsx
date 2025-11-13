import { useState, useEffect } from "react";
import { getUserByUid, addDummyUserWithInventory, connectTwoUsers, disconnectTwoUsers, sendConnectionRequest } from "../firebaseServices/database/usersFunctions";

function TestPage() {
  const [queryUser, setQueryUser] = useState(null);
  const [userId, setUserId] = useState("");
  const [dummyName, setDummyName] = useState("");
  const [user1Id, setUser1Id] = useState("");
  const [user2Id, setUser2Id] = useState("");
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");

  async function getUser(event) {
    event.preventDefault(); // Prevent form submission from reloading the page
    try {
      const user = await getUserByUid(userId);
      setQueryUser(user);
    } catch (err) {
      console.error(err);
    }
  }

  async function onSubmitAddDummyUser(event) {
    event.preventDefault();
    try {
      const { id, name } = await addDummyUserWithInventory(dummyName); // Added await to resolve the promise
      console.log(`Dummy User Added: ${name} (ID: ${id})`); // Moved log inside try block
    } catch (err) {
      console.error(err);
    }
  }

  async function onSubmitConnectTwoUsers(event) {
    event.preventDefault();
    try {
      const result = await connectTwoUsers(user1Id, user2Id);
      if (result.success) {
        console.log(result.message);
      } else {
        console.log("connect two users failed.");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function onSubmitDisconnectTwoUsers(event) {
    event.preventDefault();
    try {
      const result = await disconnectTwoUsers(user1Id, user2Id);
      if (result.success) {
        console.log(result.message);
      } else {
        console.log("disconnect two users failed.");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function onSubmitSendConnectionRequest(event) {
    event.preventDefault();
    try {
      const result = await sendConnectionRequest(senderId, receiverId);
      if (result.success) {
        console.log(result.message);
      } else {
        console.log("send connection request failed.");
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (queryUser) {
      console.log(queryUser); // Log queryUser when it updates
    }

  }, [queryUser]);

  return (
    <div>
      <h1>Testing Page</h1>
      <form onSubmit={getUser}>
        <label>User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="UcMpE727iK8qI9chFI8T"
        />
        <input type="submit" value="Console Log User" />
      </form>

      <form onSubmit={onSubmitAddDummyUser}>
        <label>Dummy Name</label>
        <input
          type="text"
          value={dummyName}
          onChange={(e) => setDummyName(e.target.value)}
          placeholder="Dummy Name"
        />
        <input type="submit" value="Add Dummy User" />
      </form>

      <form onSubmit={onSubmitConnectTwoUsers}>
        <label>User1 ID</label>
        <input
          type="text"
          value={user1Id}
          onChange={(e) => setUser1Id(e.target.value)}
          placeholder="UcMpE727iK8qI9chFI8T"
        />
        <label>User2 ID</label>
        <input
          type="text"
          value={user2Id}
          onChange={(e) => setUser2Id(e.target.value)}
          placeholder="UcMpE727iK8qI9chFI8T"
        />
        <input type="submit" value="Connect Two Users" />
      </form>

      <form onSubmit={onSubmitDisconnectTwoUsers}>
        <label>User1 ID</label>
        <input
          type="text"
          value={user1Id}
          onChange={(e) => setUser1Id(e.target.value)}
          placeholder="UcMpE727iK8qI9chFI8T"
        />
        <label>User2 ID</label>
        <input
          type="text"
          value={user2Id}
          onChange={(e) => setUser2Id(e.target.value)}
          placeholder="UcMpE727iK8qI9chFI8T"
        />
        <input type="submit" value="Disconnect Two Users" />
      </form>

      <form onSubmit={onSubmitSendConnectionRequest}>
        <label>Sender User ID</label>
        <input
          type="text"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
          placeholder="UcMpE727iK8qI9chFI8T"
        />
        <label>Receiver User ID</label>
        <input
          type="text"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          placeholder="UcMpE727iK8qI9chFI8T"
        />
        <input type="submit" value="Send Connection Request" />
      </form>
    </div>
  );
}

export default TestPage;