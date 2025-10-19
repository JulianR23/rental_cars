import { memoryDb, saveToLocalStorage, Car } from "../lib/memoryDb";

export function seedCars() {
  if (!memoryDb.cars || memoryDb.cars.length === 0) {
    const cars: Car[] = [
      {
        id: "1",
        model: "F8 Tributo",
        brand: "Ferrari",
        available: true,
        pricePerDay: 3000000,
        licensePlate: "ABC-123",
        color: "Rojo",
        year: 2022,
        imageUrl: ["/cars/1760855466738-f8tributo.jpeg"],
        category: "coupe",
      },
      {
        id: "2",
        model: "M4",
        brand: "BMW",
        available: true,
        pricePerDay: 1000000,
        licensePlate: "XYZ-789",
        color: "Blanco",
        year: 2021,
        imageUrl: ["/cars/1760855715721-bmwM4.jpeg"],
        category: "sedan",
      },
      {
        id: "3",
        model: "M8 Coupe",
        brand: "BMW",
        available: false,
        pricePerDay: 1800000,
        licensePlate: "JKL-456",
        color: "Gris Plata",
        year: 2023,
        imageUrl: ["/cars/1760856705131-m8Coupe.jpeg"],
        category: "coupe",
      },
      {
        id: "4",
        model: "911 GTR3S",
        brand: "Porsche",
        available: true,
        pricePerDay: 27000000,
        licensePlate: "LMN-987",
        color: "Negro",
        year: 2022,
        imageUrl: ["/cars/1760856746870-911Porshe.jpeg"],
        category: "sedan",
      },
      {
        id: "5",
        model: "Cayenne",
        brand: "Porsche",
        available: true,
        pricePerDay: 1400000,
        licensePlate: "QWE-456",
        color: "Azul Marino",
        year: 2021,
        imageUrl: ["/cars/1760856775411-cayennePorshe.jpeg"],
        category: "suv",
      },
    ];

    memoryDb.cars = cars;
    saveToLocalStorage();

    console.log("Cars seeded into localStorage");
  }
}
