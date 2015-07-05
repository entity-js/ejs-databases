# EntityJS - Components

## Database

Provides mongodb connectivity.

### Usage

```javascript
var database = require('ejs-database');

database.connect('default', {...}, true);
database.collection('my-collection').find({...}, ...);
```
