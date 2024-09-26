import * as fs from 'fs';
import csv from 'csv-parser';
import { PropertyService } from './propertyService';

interface Property {
    id: string;
    address: string;
    postcode: string;
    monthlyRentPence: number;
    region: string;
    capacity: number;
    tenancyEndDate: Date;
    tenants: Tenant[];
}

interface Tenant {
    id: string;
    name: string;
    propertyId: string;
}

function loadCSVData<T>(filePath: string): Promise<T[]> {
    const results: T[] = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data: T) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (err: any) => reject(err));
    });
}

// TODO: make this less messy
// TODO: log errors in a table
// TODO: hold data in a secure database
const args = process.argv.slice(2);
const command = args[0];
const input = args[1];

async function main() {
    try {
        const properties = await loadCSVData<Property>('./src/data/properties.csv');
        const tenants = await loadCSVData<Tenant>('./src/data/tenants.csv');

        const propertiesWithTenants = properties.map((property) => {
            const tenantsForProperty = tenants.filter((tenant) => tenant.propertyId === property.id);
            return { 
                ...property, 
                tenants: tenantsForProperty,
                monthlyRentPence: Number(property.monthlyRentPence),
                tenancyEndDate: new Date(property.tenancyEndDate)
            }; 
        });

        const propertyService = new PropertyService(propertiesWithTenants);

        switch (command) {
            case 'average-rent':
                if (!input) {
                    console.log('Please provide a region');
                    break;
                }
                const avgRent = propertyService.getAverageRentByRegion(input);
                console.log(`Average rent in ${input}: £${avgRent}`);
                break;

            case 'rent-per-tenant':
                if (!input) {
                    console.log('Please provide a property ID');
                    break;
                }
                const inPounds = args[2] !== 'pence';
                const rentPerTenant = propertyService.getRentPerTenant(input, inPounds);
                console.log(`Rent per tenant: £${rentPerTenant.toFixed(2)}`);
                break;

            case 'validate-postcodes':
                const invalidPostcodes = propertyService.validatePostcodes();
                if (invalidPostcodes.length > 0) {
                    console.log(`Invalid postcodes found for property IDs: ${invalidPostcodes.join(', ')}`);
                } else {
                    console.log('All postcodes are valid.');
                }
                break;

            case 'property-status':
                if (!input) {
                    console.log('Please provide a property ID');
                    break;
                }
                const status = propertyService.getPropertyStatus(input);
                console.log(`Property status: ${status}`);
                break;

            default:
                console.log('Unknown command. Available commands: average-rent, rent-per-tenant, validate-postcodes, property-status');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
