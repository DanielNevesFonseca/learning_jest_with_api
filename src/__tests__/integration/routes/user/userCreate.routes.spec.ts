import { DataSource } from "typeorm";
import { AppDataSource } from "../../../../data-source";
// é necessário import a SuperTest e o app.ts
import request from "supertest";
import app from "../../../../app";
import { User } from "../../../../entities/user.entity";
import createUserRouteMock from "../../../mocks/user/createUser.route.mock";
import supertest from "supertest";

describe("Testing the user routes", () => {
  let connection: DataSource;

  // para os erros
  const baseUrl: string = "/users";
  const userRepo = AppDataSource.getRepository(User);

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  // Executa antes de cada teste no bloco de teste
  beforeEach(async () => {
    const users: Array<User> = await userRepo.find();
    await userRepo.remove(users);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("Success: Should be able to create a new user", async () => {
    const email = "email@mail.com";
    const name = "name";
    const age = 20;

    const userData = { email, name, age };

    // aqui vai simular uma requisição com o request do supertest
    // post("/caminhoderota")
    // send("req.body")
    const response = await request(app).post("/users").send(userData);

    // Proximo passo é definir a resposta esperada
    // o status code precisa ser tal...
    expect(response.status).toBe(201);

    // o corpo precisa ser tal.
    expect(response.body).toEqual(
      expect.objectContaining({
        id: 1,
        email,
        name,
        age,
      })
    );
  });

  test("Error: Must not be able to create a user - Email already exists", async () => {
    // salvar usuário do mock
    await userRepo.save(createUserRouteMock.userUnique);

    // fazendo requisição com supertest
    const response = await supertest(app)
      .post(baseUrl)
      .send(createUserRouteMock.userUnique);

      const expectResults = {
        status: 409,
        bodyMessage: { message: 'Email already exists' },
      };
      
      // valores esperados.
      expect(response.status).toBe(expectResults.status)
      expect(response.body).toStrictEqual(expectResults.bodyMessage)
      
  })

  // declarando objeto que desejo receber
 
});
