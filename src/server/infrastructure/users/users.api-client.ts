import { userSchema, usersSchema } from "#/shared/schemas/user.schema";

export class UsersApiClient {
  async getAll() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Users API failed: ${response.status}`);
    }

    return usersSchema.parse(await response.json());
  }

  async getUserById(id: string) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Users API failed: ${response.status}`);
    }

    return userSchema.parse(await response.json());
  }
}
