import useAuth from "../firebaseServices/auth/useAuth";
import { useEffect, useState } from "react";
import {
  listenToUserFeed,
  sendConnectionRequest,
  connectTwoUsers,
} from "../firebaseServices/database/usersFunctions";
import { Link } from "react-router-dom";

function Connections() {
  const { user } = useAuth(); 
  const [connectionsDetails, setConnectionsDetails] = useState([]);
  const [nonConnectionsDetails, setNonConnectionsDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      setConnectionsDetails([]);
      setNonConnectionsDetails([]);
      return;
    }

    setLoading(true);
    setError(null);

    // Call new unified listener
    const unsubscribe = listenToUserFeed(
      user.uid,
      (connections) => {
        setConnectionsDetails(connections);
        setLoading(false); 
      },
      (nonConnections) => {
        setNonConnectionsDetails(nonConnections);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const handleSendRequest = async (receiverId) => {
    try {
      await sendConnectionRequest(user.uid, receiverId);
      console.log(`Connection request sent to ${receiverId}`);
    } catch (error) {
      console.error("Error sending connection request:", error);
    }
  };

  const handleConfirmRequest = async (senderId) => {
    try {
      await connectTwoUsers(senderId, user.uid);
      console.log(`Connection confirmed with ${senderId}`);
    } catch (error) {
      console.error("Error confirming connection request:", error);
    }
  };

  const getButtonState = (nonConnection) => {
    const iSentThemRequest = nonConnection.pendingRequestsIn?.[user.uid];
    const theySentMeRequest = nonConnection.pendingRequestsOut?.[user.uid];

    if (theySentMeRequest) {
      return (
        <button onClick={() => handleConfirmRequest(nonConnection.id)}>
          Confirm Request
        </button>
      );
    } else if (iSentThemRequest) {
      return <button disabled>Requested</button>;
    } else {
      return (
        <button onClick={() => handleSendRequest(nonConnection.id)}>
          Send Connection Request
        </button>
      );
    }
  };

  if (loading) {
    return <div>Loading connections...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  if (!user) {
    return <div>Please log in to see your connections.</div>;
  }

  return (
    <div>
      <h1>Your Trusted Connections</h1>
      {connectionsDetails.length === 0 ? (
        <p>You haven't added any connections yet.</p>
      ) : (
        <ul>
          {connectionsDetails.map((connection) => (
            <li key={connection.id}>
              <h2>{connection.displayName}</h2>
              <img
                src={connection.profileImageUrl}
                alt={`${connection.displayName}'s profile`}
                style={{ width: 100, height: 100 }}
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/100x100/eeeeee/aaaaaa?text=No+Img";
                }}
              />
              <p>Email: {connection.email}</p>
              <p>Credibility Score: {connection.credibilityScore}</p>

              {["public", "networkOnly"].includes(
                connection.consumptionSharingPrivacy
              ) ? (
                <div>
                  <h3>Consumption Summary</h3>
                  <p>
                    Appliance Count:{" "}
                    {connection.consumptionSummary.applianceCount}
                  </p>
                  <p>
                    Estimated Monthly Bill:{" "}
                    {connection.consumptionSummary.estimatedMonthlyBill}
                  </p>
                  <p>Actual Monthly Bill: {connection.actualMonthlyBill}</p>
                  <p>
                    Top Appliance: {connection.consumptionSummary.topAppliance}
                  </p>
                  <Link to={`/connections/${connection.id}/inventory`}>
                    <button>Inventory</button>
                  </Link>
                </div>
              ) : (
                <p>
                  <i>
                    {connection.displayName} has set their consumption to
                    private.
                  </i>
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <br />

      <h1>Find Connections</h1>
      {nonConnectionsDetails.length === 0 ? (
        <p>No users available to connect with.</p>
      ) : (
        <ul>
          {nonConnectionsDetails.map((nonConnection) => (
            <li key={nonConnection.id}>
              <h2>{nonConnection.displayName}</h2>
              <img
                src={nonConnection.profileImageUrl}
                alt={`${nonConnection.displayName}'s profile`}
                style={{ width: 100, height: 100 }}
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/100x100/eeeeee/aaaaaa?text=No+Img";
                }}
              />
              <p>Credibility Score: {nonConnection.credibilityScore}</p>

              {getButtonState(nonConnection)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Connections;