import { provider } from "../config/init-pact";
import { Matchers } from "@pact-foundation/pact";
import { AnimalController } from "../../../controllers";

describe("Animal Service", () => {
  beforeAll(async () => {
    await provider.setup();
  });

  afterAll(() => provider.finalize());

  describe("Get list of animals", () => {
    it("When a request to list all animals", async function () {
      await provider.addInteraction({
        uponReceiving: "Request to list all animals",
        state: "has animals",
        withRequest: {
          method: "GET",
          path: "/animals",
        },
        willRespondWith: {
          status: 200,
          body: Matchers.eachLike({
            name: Matchers.like("Mateo"),
            breed: Matchers.like("Persa"),
            gender: Matchers.like("Male"),
            vaccinated: Matchers.boolean(true),
          }),
        },
      });

      const response = await AnimalController.list();

      expect(response.data).toMatchSnapshot();
      await provider.verify();
    });
  }),
    describe("Create an animal", () => {
      it("When a request to create an animal", async function () {
        await provider.addInteraction({
          uponReceiving: "Request to add a new animal",
          state: "There are no animals",
          withRequest: {
            method: "POST",
            path: "/animals",
          },
          willRespondWith: {
            status: 201, 
            body: {
              id: Matchers.like(1),
              name: Matchers.like("Mateo"),
              breed: Matchers.like("Persa"),
              gender: Matchers.like("Male"),
              vaccinated: Matchers.boolean(true),
              vaccines: ["moquillo", "parvovirosis"],
            },
          },
        });

        const currentAnimal = {
          
          name: "Mateo",
          breed: "Persa",
          gender: "Male",
          vaccinated: true,
          vaccines: ["moquillo", "parvovirosis"],
        };
        const res = await AnimalController.register(currentAnimal);
        expect(res.data).toMatchSnapshot();

        await provider.verify();
      });
    }),
    describe("Delete an animal", () => {
      it("When a request to delete an animal", async function () {
        await provider.addInteraction({
          uponReceiving: "Request to delete an animal",
          state: "Delete an animal",
          withRequest: {
            method: "DELETE",
            path: "/animals/Mateo",
          },
          willRespondWith: {
            status: 204, 
          },
        });

        const response = await AnimalController.delete("Mateo");

        expect(response.data).toMatchSnapshot();
        await provider.verify();
      });
    }),
    describe("Obtain a one animal", () => {
      it("When a request to  get an animal", async function () {
        await provider.addInteraction({
          uponReceiving: "Request to get an animal",
          state: "Get an animal by its name",
          withRequest: {
            method: "GET",
            path: "/animals/Mateo",
          },
          willRespondWith: {
            status: 200,
            body: {
              id: Matchers.like(1),
              name: Matchers.like("Mateo"),
              breed: Matchers.like("Persa"),
              gender: Matchers.like("Male"),
              vaccinated: Matchers.boolean(true),
              vaccines: ["moquillo", "parvovirosis"],
            },
          },
        });

        const response = await AnimalController.getAnimal("Mateo");

        expect(response.data).toMatchSnapshot();
        await provider.verify();
      });
    }),
    describe("Allow verified the edit of an animal", () => {
      it("When a request to edit an animal", async function () {
        await provider.addInteraction({
          uponReceiving: "Request to update an animal",
          state: "Update an animal",
          withRequest: {
            method: "PUT",
            path: "/animals/Mateo",
          },
          willRespondWith: {
            status: 200,
            body: {
              id: Matchers.like(1),
              name: Matchers.like("Mateo"),
              breed: Matchers.like("Persa"),
              gender: Matchers.like("Male"),
              vaccinated: Matchers.boolean(true),
              vaccines: ["moquillo","parvovirosis"],
            },
          },
        });

        const currentAnimal = {
          name: "Mateo",
          breed: "Persa",
          gender: "Male",
          vaccinated: true,
          vaccines: ["moquillo", "parvovirosis"],
        };
        const response = await AnimalController.updateAnimal('Mateo', currentAnimal);

        expect(response.data).toMatchSnapshot();
        await provider.verify();
      });
    });
});