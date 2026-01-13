/**
 * General utility functions for geometric calculations and request processing.
 * Provides point-in-polygon detection and IP address extraction from HTTP requests.
 * Used for game logic and security/analytics purposes.
 */
export const isPointInsidePolygon = (point, polygon) => {
    const x = Number(point[0]),
        y = Number(point[1]);
    let isInside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0],
            yi = polygon[i][1];
        const xj = polygon[j][0],
            yj = polygon[j][1];

        const intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

        if (intersect) isInside = !isInside;
    }

    return isInside;
};

export const getIpAddress = (request: any) => {
    const getIP =
        request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
    return getIP.split(',')[0];
};
