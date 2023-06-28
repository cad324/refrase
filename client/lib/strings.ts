export function isValidUrl(url: string) {
    const pattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    return pattern.test(url);
};