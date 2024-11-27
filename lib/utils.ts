import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToAscii(inputString: string) {
  // remove non ascii characters
  const asciiString = inputString.replace(/[^\x00-\x7F]+/g, "");
  return asciiString;
}

export const extractUUIDFromString = (url: string) => {
  return url.match(
    /^[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$/i
  );
};

export const postToParent = (message: string) => {
  window.parent.postMessage(message, "*");
};

export const extractURLfromString = (url: string) => {
  return url.match(/https?:\/\/[^\s"<>]+/);
};

export const extractEmailsFromString = (text: string) => {
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
};

export const getMonthName = (month: number) => {
  return month == 1
    ? "Jan"
    : month == 2
    ? "Feb"
    : month == 3
    ? "Mar"
    : month == 4
    ? "Apr"
    : month == 5
    ? "May"
    : month == 6
    ? "Jun"
    : month == 7
    ? "Jul"
    : month == 8
    ? "Aug"
    : month == 9
    ? "Sep"
    : month == 10
    ? "Oct"
    : month == 11
    ? "Nov"
    : month == 12 && "Dec";
};
