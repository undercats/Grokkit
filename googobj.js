//PROFILE as given by google IS:

{ id: '100894241544547391597',
 displayName: 'Gabe Thexton',
 name: { familyName: 'Thexton', givenName: 'Gabe' },
 emails: [ { value: 'gabethexton@gmail.com', type: 'account' } ],
 photos: [ { value: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50' } ],
 gender: 'male',
 provider: 'google',
 _raw: '{\n "kind": "plus#person",\n "etag": "\\"xw0en60W6-NurXn4VBU-CMjSPEw/nvtMxeJWAmj1SdSPtIcNsDt2Fdc\\"",\n "occupation": "I make people happy by fixing their gadgets.",\n "gender": "male",\n "emails": [\n  {\n   "value": "gabethexton@gmail.com",\n   "type": "account"\n  }\n ],\n "objectType": "person",\n "id": "100894241544547391597",\n "displayName": "Gabe Thexton",\n "name": {\n  "familyName": "Thexton",\n  "givenName": "Gabe"\n },\n "tagline": "Married with furry children.",\n "url": "https://plus.google.com/100894241544547391597",\n "image": {\n  "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50",\n  "isDefault": true\n },\n "isPlusUser": true,\n "language": "en",\n "circledByCount": 79,\n "verified": false\n}\n',
 _json:
  { kind: 'plus#person',
    etag: '"xw0en60W6-NurXn4VBU-CMjSPEw/nvtMxeJWAmj1SdSPtIcNsDt2Fdc"',
    occupation: 'I make people happy by fixing their gadgets.',
    gender: 'male',
    emails: [ [Object] ],
    objectType: 'person',
    id: '100894241544547391597',
    displayName: 'Gabe Thexton',
    name: { familyName: 'Thexton', givenName: 'Gabe' },
    tagline: 'Married with furry children.',
    url: 'https://plus.google.com/100894241544547391597',
    image:
     { url: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50',
       isDefault: true },
    isPlusUser: true,
    language: 'en',
    circledByCount: 79,
    verified: false } }


// profile / USER as cleaned up from google=
 { userName: 'gabethexton',
  displayName: 'Gabe Thexton',
  firstName: 'Gabe',
  lastName: 'Thexton',
  userImage: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50',
  emailAddress: 'gabethexton@gmail.com',
  accessToken: 'ya29.CjAXAxuFiBJFFIJ0iLFMeM2ydXRIzOu-X-v1-qNONwsUvw_PQ5eBjywOhxLKVOORzcc',
  refreshToken: undefined }

// SESSION as created by passport =
{ passport:
   { user:
      { userName: 'gabethexton',
        displayName: 'Gabe Thexton',
        firstName: 'Gabe',
        lastName: 'Thexton',
        userImage: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50',
        emailAddress: 'gabethexton@gmail.com',
        accessToken: 'ya29.CjAXAxuFiBJFFIJ0iLFMeM2ydXRIzOu-X-v1-qNONwsUvw_PQ5eBjywOhxLKVOORzcc',
        refreshToken: undefined } } }

// USER as pulled from DataBase
         [ { id: 2,
            username: 'gabethexton',
            email: 'gabethexton@gmail.com',
            first_name: 'Gabe',
            last_name: 'Thexton',
            user_image: null } ]
