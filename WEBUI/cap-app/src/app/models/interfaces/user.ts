import { rolesEnum } from 'src/app/models/Enum/roles';

export class User {
    id: number;
    firstName: string;
    lastName: string;
    UserName: string;
    Token?: string;
    Usertype?: rolesEnum;
    Name?: string;
    UserId?: number;
    BatchIds?: string;
    BatchId?: number;
    // FranchiseId?: number;
    CenterAdminId?: number;
}
