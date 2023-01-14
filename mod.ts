/**
 * This code defines a `localbase()` function which provides
 * a set of methods for interacting with a local file system.
 *
 * Specifically, it includes methods for:
 * open(): Reads the contents of a file
 * mkdir(): Creates a new directory
 * create(): Creates a new empty file
 * push(): Writes an entry to a file
 * replace(): Replaces an identifiable object in a file
 * append(): Appends a value to an object in a file
 * remove(): Removes a directory or an identifiable object from a file
 *
 * Finally, the code exports the `localbase()` function, allowing
 * it to be used elsewhere in the codebase.
 */
function localbase() {
  /**
   * Open JSON file (get)
   * @param path
   * @returns
   */
  const open = (path: string) => {
    try {
      const raw = Deno.readTextFileSync(path);
      return JSON.parse(raw);
    } catch (_err) {
      create(path);
      const raw = Deno.readTextFileSync(path);
      return JSON.parse(raw);
    }
  };
  /**
   * Create new directory
   * @param path
   */
  const mkdir = (path: string) => {
    try {
      Deno.mkdirSync(path, { recursive: true });
    } catch (err) {
      console.error(err);
    }
  };
  /**
   * Create a new empty file
   * @param path
   */
  const create = (path: string) => {
    try {
      Deno.writeTextFileSync(path, "[]");
    } catch (err) {
      console.error(err);
    }
  };
  /**
   * Write entry to file (post)
   * @param path
   * @param data
   */
  const push = (path: string, data: Record<string, string>) => {
    try {
      const raw = Deno.readTextFileSync(path);
      const json = JSON.parse(raw);
      Object.assign(data, { id: crypto.randomUUID() });
      json.push(data);
      Deno.writeTextFileSync(path, JSON.stringify(json, null, 2));
    } catch (err) {
      console.error(err);
    }
  };
  /**
   * Replace identifiable object (put)
   * @param path
   * @param id
   * @param data
   */
  const replace = (path: string, id: string, data: Record<string, string>) => {
    try {
      const raw = Deno.readTextFileSync(path);
      const json = JSON.parse(raw);
      const index = json.findIndex((i: Record<string, string>) => i.id === id);
      data.id = id;
      json[index] = data;
      Deno.writeTextFileSync(path, JSON.stringify(json, null, 2));
    } catch (err) {
      console.error(err);
    }
  };
  /**
   * Append value to object (patch)
   * @param path
   * @param id
   * @param data
   */
  const append = (path: string, id: string, data: Record<string, string>) => {
    try {
      const raw = Deno.readTextFileSync(path);
      const json = JSON.parse(raw);
      const index = json.findIndex((i: Record<string, string>) => i.id === id);
      data.id = id;
      json[index] = {
        ...json[index],
        ...data,
      };
      Deno.writeTextFileSync(path, JSON.stringify(json, null, 2));
    } catch (err) {
      console.error(err);
    }
  };
  /**
   * Remove directory or identifiable object (dlete)
   * @param path
   * @param id
   */
  const remove = (path: string, id?: string) => {
    try {
      if (id) {
        const raw = Deno.readTextFileSync(path);
        const json = JSON.parse(raw);
        const filtered = json.filter((item: Record<string, string>) => {
          return item.id !== id;
        });
        Deno.writeTextFileSync(path, JSON.stringify(filtered, null, 2));
      } else {
        Deno.removeSync(path, { recursive: true });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    mkdir,
    create,
    open,
    push,
    replace,
    append,
    remove,
  };
}

export default localbase;
