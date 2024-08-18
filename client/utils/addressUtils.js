// utils/addressUtils.js

const addresses = [
    {
        "address1": "1600 Amphitheatre Parkway",
        "address2": "",
        "city": "Mountain View",
        "state": "CA",
        "postalCode": "94043",
        "coordinates": {
            "lat": 37.4221,
            "lng": -122.0841
        }
    },
    {
        "address1": "1 Infinite Loop",
        "address2": "",
        "city": "Cupertino",
        "state": "CA",
        "postalCode": "95014",
        "coordinates": {
            "lat": 37.3318,
            "lng": -122.0312
        }
    },
    {
        "address1": "350 5th Ave",
        "address2": "",
        "city": "New York",
        "state": "NY",
        "postalCode": "10118",
        "coordinates": {
            "lat": 40.7484,
            "lng": -73.9857
        }
    },
    {
        "address1": "111 8th Ave",
        "address2": "",
        "city": "New York",
        "state": "NY",
        "postalCode": "10011",
        "coordinates": {
            "lat": 40.7411,
            "lng": -74.0026
        }
    },
    {
        "address1": "1 Microsoft Way",
        "address2": "",
        "city": "Redmond",
        "state": "WA",
        "postalCode": "98052",
        "coordinates": {
            "lat": 47.6397,
            "lng": -122.1287
        }
    },
    {
        "address1": "1600 Pennsylvania Ave NW",
        "address2": "",
        "city": "Washington",
        "state": "DC",
        "postalCode": "20500",
        "coordinates": {
            "lat": 38.8977,
            "lng": -77.0365
        }
    },
    {
        "address1": "1211 Avenue of the Americas",
        "address2": "",
        "city": "New York",
        "state": "NY",
        "postalCode": "10036",
        "coordinates": {
            "lat": 40.7587,
            "lng": -73.9828
        }
    },
    {
        "address1": "221B Baker Street",
        "address2": "",
        "city": "London",
        "state": "UK",
        "postalCode": "NW1 6XE",
        "coordinates": {
            "lat": 51.5237,
            "lng": -0.1585
        }
    },
    {
        "address1": "405 Howard St",
        "address2": "",
        "city": "San Francisco",
        "state": "CA",
        "postalCode": "94105",
        "coordinates": {
            "lat": 37.7880,
            "lng": -122.3969
        }
    },
    {
        "address1": "500 Terry A Francois Blvd",
        "address2": "",
        "city": "San Francisco",
        "state": "CA",
        "postalCode": "94158",
        "coordinates": {
            "lat": 37.7707,
            "lng": -122.3870
        }
    }
];

export const getRandomAddress = () => {
    return addresses[Math.floor(Math.random() * addresses.length)];
};

export const isValidAddress = (address) => {
    return addresses.some(storedAddress =>
        storedAddress.address1 === address.street_address &&
        storedAddress.city === address.city &&
        storedAddress.postalCode === address.postal_code
    );
};

export const getAddress = (address) => {
    if (!address || !address.street_address || !address.city || !address.postal_code) {
        return getRandomAddress();
    }
    return address;
};
