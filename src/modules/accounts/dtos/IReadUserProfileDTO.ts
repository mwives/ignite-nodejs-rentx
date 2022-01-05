interface IReadUserProfileDTO {
  id: string;
  driver_license: string;
  name: string;
  email: string;
  avatar: string;
  avatar_url(): string | null;
}

export { IReadUserProfileDTO };
