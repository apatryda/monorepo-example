import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Embedding {
    @PrimaryGeneratedColumn()
    id: number

    // Vector without specified dimensions (works on PostgreSQL and SAP HANA)
    @Column("vector")
    embedding: number[] | Buffer

    // Vector with 3 dimensions: vector(3) (works on PostgreSQL and SAP HANA)
    @Column("vector", { length: 3 })
    embedding_3d: number[] | Buffer

    // Half-precision vector with 4 dimensions: halfvec(4) (works on PostgreSQL and SAP HANA)
    @Column("halfvec", { length: 4 })
    halfvec_embedding: number[] | Buffer
}
