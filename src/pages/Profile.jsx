import useAuth from "../firebaseServices/auth/useAuth";

function Profile() {
  const { firestoreUser, firestoreLoading } = useAuth();
  
  if (firestoreLoading) {
    return <div>Loading...</div>;
  }

  if (!firestoreUser) {
    return <div>No user data available.</div>;
  }

  const formatTimestamp = (ts) => {
    if (!ts) return "N/A";
    const date = ts.toDate();
    const timeZone = "Asia/Manila"; // use an IANA zone that is UTC+8
    const datePart = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone,
    }).format(date);
    const timePart = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone,
    }).format(date);
    const tzNamePart = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "short",
    })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value;
    const tz = tzNamePart ? tzNamePart.replace("GMT", "UTC") : "UTC+8";
    return `${datePart} at ${timePart} ${tz}`;
  };

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {firestoreUser.displayName}</p>
      <img src={firestoreUser.profileImageUrl} alt="profile" />
      <p>Email: {firestoreUser.email}</p>
      
      <p>Location: GeoPoint({firestoreUser.location.latitude}, {firestoreUser.location.longitude})</p>
      <p>Name: {firestoreUser.displayName}</p>
      <hr />
      <p>Connections:</p>
      <ul>
        {Object.keys(firestoreUser.connections).map(key => (
          <li key={key}>
            <p>{key}</p>
          </li>
        ))}
      </ul>
      <p>Pending Requests In: </p>
      <ul>
        {Object.keys(firestoreUser.pendingRequestsIn).map(key => (
          <li key={key}>
            <p>{key}</p>
          </li>
        ))}
      </ul>
      <p>Pending Requests Out: </p>
      <ul>
        {Object.keys(firestoreUser.pendingRequestsOut).map(key => (
          <li key={key}>
            <p>{key}</p>
          </li>
        ))}
      </ul>
      <hr />
      <p>Consumption Sharing Privacy: {firestoreUser.consumptionSharingPrivacy}</p>
      <p>Consumption Summary</p>
      <ul>
        <li>Appliance Count: {firestoreUser.consumptionSummary.applianceCount}</li>
        <li>Estimated Monthly Bill: {firestoreUser.consumptionSummary.estimatedMonthlyBill}</li>
        <li>Top Appliance (by Consumption Cost): {firestoreUser.consumptionSummary.topAppliance}</li>
      </ul>
      
      
      <p>Last Report Time: {formatTimestamp(firestoreUser.lastReportTime)}</p>
    </div>
  );
}

export default Profile;