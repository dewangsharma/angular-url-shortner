export const IsNullOrEmpty = function (text: string): boolean {
  return text === null || text.match(/^ *$/) !== null;
};
