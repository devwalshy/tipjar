import { 
  users, 
  type User, 
  type InsertUser, 
  partners, 
  type Partner, 
  type InsertPartner,
  distributions,
  type Distribution,
  type InsertDistribution
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Partner methods
  getPartner(id: number): Promise<Partner | undefined>;
  getPartners(): Promise<Partner[]>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  
  // Distribution methods
  getDistribution(id: number): Promise<Distribution | undefined>;
  getDistributions(): Promise<Distribution[]>;
  createDistribution(distribution: InsertDistribution): Promise<Distribution>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private partners: Map<number, Partner>;
  private distributions: Map<number, Distribution>;
  private userId: number;
  private partnerId: number;
  private distributionId: number;

  constructor() {
    this.users = new Map();
    this.partners = new Map();
    this.distributions = new Map();
    this.userId = 1;
    this.partnerId = 1;
    this.distributionId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Partner methods
  async getPartner(id: number): Promise<Partner | undefined> {
    return this.partners.get(id);
  }
  
  async getPartners(): Promise<Partner[]> {
    return Array.from(this.partners.values());
  }
  
  async createPartner(insertPartner: InsertPartner): Promise<Partner> {
    const id = this.partnerId++;
    const partner: Partner = { ...insertPartner, id };
    this.partners.set(id, partner);
    return partner;
  }
  
  // Distribution methods
  async getDistribution(id: number): Promise<Distribution | undefined> {
    return this.distributions.get(id);
  }
  
  async getDistributions(): Promise<Distribution[]> {
    return Array.from(this.distributions.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createDistribution(insertDistribution: InsertDistribution): Promise<Distribution> {
    const id = this.distributionId++;
    const distribution: Distribution = { 
      ...insertDistribution, 
      id, 
      date: new Date().toISOString() 
    };
    this.distributions.set(id, distribution);
    return distribution;
  }
}

export const storage = new MemStorage();
