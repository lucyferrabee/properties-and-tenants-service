# Properties and Tenants Service

## About
This is a simple project that handles data relating to tenants and properties.
Tests have been written to exhibit the functionality, commands to run them on the command line are below.
A command line tool has also been created that loads real csv file data and runs the calculations on them. Commands below.

## Requirements
- Node.js
- TypeScript

## Setup

1. Clone the repository:

```git clone git@github.com:lucyferrabee/properties-and-tenants-service.git```

```cd properties-and-tenants-service```

2. Install dependencies:

```npm install```

3. Compile the TypeScript code:

```npm run build```

4. Run tests:

```npm test```

5. Command line commands for running real data:

```npm start average-rent {region}```

```npm start rent-per-tenant {propertyId} pounds```

```npm start rent-per-tenant {propertyId} pence```

```npm start validate-postcodes```

```npm start property-status {propertyId}```

e.g:

```npm start average-rent ENGLAND```

```npm start rent-per-tenant p_1100 pounds```

```npm start rent-per-tenant p_1100 pence```

```npm start validate-postcodes```

```npm start property-status p_1037```

## Tasks

- Calculate the average rent by region
- Calculate rent per tenant
- Validate UK postcodes
- Get property status
