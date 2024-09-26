interface Property {
    id: string;
    address: string;
    postcode: string;
    monthlyRentPence: number
    region: string;
    capacity: number;
    tenancyEndDate: Date;
    tenants: Tenant[];
}

export class PropertyService {
    constructor(private properties: Property[]) {}

// Task 1: Calculate average rent for a region
getAverageRentByRegion(region: string): number {
    const propertiesInRegion = this.properties.filter(prop => prop.region === region);
    if (propertiesInRegion.length === 0) throw new Error("Region not found");

    const totalRent = propertiesInRegion.reduce((sum, prop) => sum + prop.monthlyRentPence, 0);
    return totalRent / propertiesInRegion.length;
}

// Task 2: Calculate rent per tenant for a property
getRentPerTenant(propertyId: string, inPounds = true): number {
    const property = this.properties.find(prop => prop.id === propertyId);
    if (!property) throw new Error("Property not found");

    const numTenants = property.tenants.length;
    if (numTenants === 0) throw new Error("No tenants");

    const rentPerTenant = property.monthlyRentPence / numTenants;
    return inPounds ? rentPerTenant / 100 : rentPerTenant;
}

// Task 3: Validate UK postcodes (simple regex)
validatePostcodes(): string[] {
    const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
    return this.properties
        .filter(prop => !ukPostcodeRegex.test(prop.postcode))
        .map(prop => prop.id);
}

// Task 4: Get the status of a property
getPropertyStatus(propertyId: string): string {
    const property = this.properties.find(prop => prop.id === propertyId);
    if (!property) throw new Error("Property not found");

    const currentDate = new Date();
    if (property.tenants.length === 0) return "PROPERTY_VACANT";
    if (currentDate > property.tenancyEndDate) return "PROPERTY_OVERDUE";
    if (property.tenants.length < property.capacity) return "PARTIALLY_VACANT";
    return "PROPERTY_ACTIVE";
}
}