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

interface Tenant {
    id: string,
    name: string,
}

export class PropertyService {
    constructor(private properties: Property[]) {}

getAverageRentByRegion(region: string): number {
    const propertiesInRegion = this.properties.filter(prop => prop.region === region);
    
    if (propertiesInRegion.length === 0) throw new Error("Region not found");
    
    const totalRentInPence = propertiesInRegion.reduce((sum, prop) => sum + prop.monthlyRentPence, 0);
    const totalRentInPounds = totalRentInPence / 100;
    
    const averageRent = totalRentInPounds / propertiesInRegion.length;
        
    return Math.round(averageRent);
}

getRentPerTenant(propertyId: string, inPounds = true): number {
    const property = this.properties.find(prop => prop.id === propertyId);
    if (!property) throw new Error("Property not found");

    const numTenants = property.tenants.length;
    if (numTenants === 0) throw new Error("No tenants");

    const rentPerTenant = property.monthlyRentPence / (numTenants * 100);
    return inPounds ? parseFloat(rentPerTenant.toFixed(2)) : Math.round(rentPerTenant * 100);
}

validatePostcodes(): string[] {
    const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
    return this.properties
        .filter(prop => !ukPostcodeRegex.test(prop.postcode))
        .map(prop => prop.id);
}

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
