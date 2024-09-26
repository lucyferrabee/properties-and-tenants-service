// tests/propertyService.test.ts
import { PropertyService } from '../src/propertyService';

describe('PropertyService', () => {
    const mockProperties = [
        { id: '1', address: '1 Street Road', postcode: 'SW1A 1AA', monthlyRentPence: 123400, region: 'ENGLAND', capacity: 2, tenancyEndDate: new Date('2025-01-01'), tenants: [{ id: 't1', name: 'John Jones' }] },
        { id: '2', address: '10 Station Road', postcode: 'W1A 0AX', monthlyRentPence: 53400, region: 'WALES', capacity: 4, tenancyEndDate: new Date('2027-05-01'), tenants: [] },
        { id: '3', address: '144 Albury Road', postcode: 'M1 1AE', monthlyRentPence: 234200, region: 'ENGLAND', capacity: 3, tenancyEndDate: new Date('2028-03-015'), tenants: [{ id: 't2', name: 'Jane Jeffrey' }, { id: 't3', name: "Hannah Partridge"}, { id: 't4', name: "Misha Smith"}] },
    ];

    const service = new PropertyService(mockProperties);

    test('calculates average rent by region for multiple properties', () => {
        expect(service.getAverageRentByRegion('ENGLAND')).toBe(178800);
    });

    test('calculates average rent by region for one property', () => {
        expect(service.getAverageRentByRegion('WALES')).toBe(53400);
    });

    test('throws error for 0 properties in a region', () => {
        expect(() => service.getAverageRentByRegion('LONDON')).toThrow("Region not found");
    });

    test('calculates rent per tenant in pounds', () => {
        expect(service.getRentPerTenant('1')).toBe(1234);
        expect(() => service.getRentPerTenant('2')).toThrow("No tenants");
        expect(service.getRentPerTenant('3')).toBe(780.6666666666667);
    });

    test('validates invalid postcodes', () => {
        const invalidPostcodes = service.validatePostcodes();
        expect(invalidPostcodes.length).toBe(0);
    });

    test('returns property status', () => {
        expect(service.getPropertyStatus('1')).toBe('PARTIALLY_VACANT');
        expect(service.getPropertyStatus('2')).toBe('PROPERTY_VACANT');
        expect(service.getPropertyStatus('3')).toBe('PROPERTY_ACTIVE');
    });
});
