export interface ApiTypes {
    location: any;
    objects : {
        discriminator: string,
        platesNumber: string,
        sideNumber: string,
        color: string,
        type: string,
        picture: {
            id: string,
            name: string,
            extension: string | null,
            contentType: string | null,
        },
        rangeKm: number,
        batteryLevelPct: number,
        reservationEnd: string | null,
        reservation: string | null,
        status: string,
        locationDescription: any,
        address: any,
        mapColor: {
            rgb: string,
            alpha: number,
        }
        promotion: any,
        id: string,
        name: string,
        description: string | null,
        location: {
            latitude: number,
            longitude: null
        },
        metadata: any
        map(element: (item: ApiTypes) => JSX.Element): Boolean;
    }
}