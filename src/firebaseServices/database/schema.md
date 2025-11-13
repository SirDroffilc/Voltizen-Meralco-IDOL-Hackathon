## Firestore Database Collections

### `users` Collection: Document Schema

#### Fields:

1. **`displayName`**

    - **Type**: `string`
    - **Description**: The user's display name.

2. **`email`**

    - **Type**: `string`
    - **Description**: The user's email address.

3. **`profileImageUrl`**

    - **Type**: `string`
    - **Description**: The URL of the user's profile image.

4. **`location`**

    - **Type**: `geopoint`
    - **Description**: The user's geographical location, represented as latitude and longitude.

5. **`connections`**

    - **Type**: `map`
    - **Description**: A map of user IDs representing the user's connections. Each key is a `userID` and the value is a `boolean` indicating the connection status.

6. **`pendingRequestsIn`**

    - **Type**: `map`
    - **Description**: A map of incoming connection requests. Each key is a `userID` and the value is a `boolean` indicating the request status.

7. **`pendingRequestsOut`**

    - **Type**: `map`
    - **Description**: A map of outgoing connection requests. Each key is a `userID` and the value is a `boolean` indicating the request status.

8. **`consumptionSharingPrivacy`**

    - **Type**: `string`
    - **Description**: The privacy setting for sharing consumption data. Possible values include `"private"`, `"connectionsOnly"`, and `"public"`.

9. **`consumptionSummary`**

    - **Type**: `map`
    - **Description**: A map summarizing the user's electricity consumption data. Contains the following fields:
        - **`isCalculatedBefore`**: `boolean` - The boolean state that tells whether the consumptionSummary had been calculated before.
        - **`applianceCount`**: `number` - The total number of appliances the user owns.
        - **`estimatedDailyBill`**: `number` - The user's estimated monthly electricity bill.
        - **`estimatedWeeklyBill`**: `number` - The user's estimated monthly electricity bill.
        - **`estimatedMonthlyBill`**: `number` - The user's estimated monthly electricity bill.
        - **`topAppliance`**: `string` - The name of the appliance contributing the most to electricity consumption.

10. **`actualMonthlyBill`**

    - **Type**: `number`
    - **Description**: The user's actual monthly electricity bill.

11. **`credibilityScore`**

    - **Type**: `number`
    - **Description**: A score representing the user's credibility within the app.

12. **`lastReportTime`**

    - **Type**: `timestamp`
    - **Description**: The timestamp of the user's last report submission.

13. **`inventory`**

    - **Type**: `subcollection`
    - **Description**: The user's inventory of appliances. Each document in this subcollection represents a single appliance (document ID: `applianceId`).

    Appliance document schema:

    1. **`name`**

        - **Type**: `string`
        - **Description**: The name or model of the appliance.

    2. **`type`**

        - **Type**: `string`
        - **Description**: The type of appliance. Possible values include `"Air Conditioner"`, `"Electric Fan"`, `"Laptop"`, `"Desktop Computer"`, `"Phone"`, etc.

    3. **`wattage`**

        - **Type**: `number`
        - **Description**: The appliance's wattage (watts).

    4. **`hoursPerDay`**

        - **Type**: `number`
        - **Description**: Average hours used per day.

    5. **`daysPerWeek`**

        - **Type**: `number`
        - **Description**: Average days used per week (0–7).

    6. **`specificDaysUsed`**

        - **Type**: `map`
        - **Description**: A map indicating usage on specific weekdays. Example: `{ monday: true, tuesday: false, wednesday: true, thursday: false, friday: true, saturday: false, sunday: false }`.

    7. **`weeksPerMonth`**

        - **Type**: `number`
        - **Description**: Average weeks per month the appliance is used.

    8. **`addedBy`**

        - **Type**: `string`
        - **Description**: Method by which the appliance was added. Possible values: `"ai"`, `"manual"`, `"liveMonitoring"`.

    9. **`imageUrl`**

        - **Type**: `string`
        - **Description**: The URL (Cloudinary) of the image of the appliance.

    10. **`kWhPerDay`**

        - **Type**: `number`
        - **Description**: The energy consumption in kilowatt-hours per day.

    11. **`dailyCost`**

        - **Type**: `number`
        - **Description**: The cost of running the appliance per day.

    12. **`weeklyCost`**

        - **Type**: `number`
        - **Description**: The cost of running the appliance per week.

    13. **`monthlyCost`**
        - **Type**: `number`
        - **Description**: The cost of running the appliance per month.

### `reports` Collection: Document Schema

#### Fields:

1. **`reporterId`**

    - **Type**: `string`
    - **Description**: The uid of the user who submitted the report.

2. **`reporterName`**

    - **Type**: `string`
    - **Description**: The display name of the user who submitted the report.

3. **`description`**

    - **Type**: `string`
    - **Description**: The description of the report.

4. **`imageURL`**

    - **Type**: `string`
    - **Description**: The URL (Cloudinary) of the image attached to the report.

5. **`status`**

    - **Type**: `string`
    - **Description**: The current status of the report. Possible values include `"pending"`, `"approved"`, and `"rejected"`.

6. **`timeCreated`**
    - **Type**: `timestamp`
    - **Description**: The timestamp of the report's submission.

### `announcements` Collection: Document Schema

#### Fields:

1. **`title`**

    - **Type**: `string`
    - **Description**: The title of the announcement.

2. **`type`**

    - **Type**: `string`
    - **Description**: The type of the event in this announcement. Possible values include `"brownout"`, `"safety hazard"`, and `"weather"`.

3. **`description`**

    - **Type**: `string`
    - **Description**: The description of the report.

4. **`location`**

    - **Type**: `geopoint`
    - **Description**: The event's geographical location, represented as latitude and longitude.

5. **`radius`**

    - **Type**: `number`
    - **Description**: The radius (in kilometers) around the `location` that the announcement applies to.

6. **`startTime`**

    - **Type**: `timestamp`
    - **Description**: The timestamp of the start of the event in this announcement.

7. **`endTime`**

    - **Type**: `timestamp`
    - **Description**: The timestamp of the end of the event in this announcement.

8. **`timeCreated`**
    - **Type**: `timestamp`
    - **Description**: The timestamp of the event's upload.
