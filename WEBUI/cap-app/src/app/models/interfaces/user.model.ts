export class User {
    constructor() {
        this.userId = null;
        this.userName = null;
        this.password = null;
        this.emailId = null;
        this.birthDate = null;

        this.firstName = null;
        this.lastName = null;
        this.phoneNumber = null;
        this.parentFirstName = null;
        this.parentLastName = null;
        this.stuAge = null;
        this.programId = null;
        this.studentGrade = null;
        this.confirmPassword = null;
        this.streetAddressOne = null;
        this.streetAddressTwo = null;
        this.city = null;
        this.state = null;
        this.postalCode = null;
        this.hearUs = null;
    }

    userId: number;
    userName: string;
    password: string;
    emailId: string;
    birthDate: Date;

    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    parentFirstName?: string;
    parentLastName?: string;
    stuAge?: number;
    programId?: number;
    studentGrade?: number;
    confirmPassword?: string;
    streetAddressOne?: string;
    streetAddressTwo?: string;
    city?: string;
    state?: string;
    postalCode?: number;
    hearUs?: string;
}
