export function warn(...args: any[]) {
  const message = args.join(" ");
  console.warn("[WARNING]", message);
}

export function log(...args: any[]) {
  const message = args.join(" ");
  console.warn("[LOG]", message);
}

export function error(...args: any[]) {
  const message = args.join(" ");
  console.warn("[ERROR]", message);
}

export function readEnvVar(name: string, fallback: any): any {
  const envValue = process.env[name];

  // If the environment variable DNE return fallback
  if (envValue === undefined) {
    warn(
      "Unable to access environment var '",
      name,
      "', fallback to ",
      fallback
    );
    return fallback;
  }
  // If the environment variable exists, attempt to parse it as a number
  const parsedNumber = parseFloat(envValue);
  if (!isNaN(parsedNumber)) {
    // If it's a valid number, return the parsed number
    return parsedNumber;
  } else {
    // If it's not a valid number, return the string value
    return envValue;
  }
}
