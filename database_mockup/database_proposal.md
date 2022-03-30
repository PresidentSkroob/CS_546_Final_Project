# Database Proposal

## User Collection

```JSON
{
    "_id": "9394ae340043024fl30",
    "userName": "theuser",					// Username could be the email address instead
    "password": "thepassword",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@gmail.com",
    "appointment_ids": ["8281hx392lei90", "1949kak2932e", "..."],
    "review_ids": ["88a23sdas9239as", "..."]
}
```

## Review Collection

```JSON
{
    "_id": "88a23sdas9239as",
    "poster_id": "9394ae340043024fl30",
    "body": "Excellent experience!",
    "rating": "4.7"
}
```

## Appointments Collection

```JSON
{
    "_id": "8281hx392lei90",
    "customer_id": "9394ae340043024fl30",
    "hairdresser_id": "123acfx104302430iw",
    "date": "05/18/2016",
    "startTime": "18:00",
    "endTime": "18:30",
    "service": "Color",
    "comments": "Please use XYZ brand."
    // "price": $30,
}
```
