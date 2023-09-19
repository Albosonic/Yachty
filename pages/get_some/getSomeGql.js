import { gql } from "@apollo/client";
// TODO: mock regions
export const COMODORES = [
  {email: 'albertomadueno@gmail.com', firstName: "Alberto", lastName: "Madueno", name: "Alberto Madueno", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
  {email: 'snipeboatblue@gmail.com', firstName: "Alberto", lastName: "Madueno", name: "Alberto Madueno", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
  {email: 'khaatveit@gmail.com', firstName: "Kersti", lastName: "Haatveit", name: "Kersti Haatveit", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
];

export const mockMembers = [
  {email: 'jackblack@gmail.com', firstName: "Jack", lastName: "Black", name: "Jack Black", secondEmail: 'jackwhite@gmail.com', secondFirstName: "Jacko", secondLastName: "White", secondName: "Jacko White"},
  {email: 'bob@gmail.com', firstName: "Bob", lastName: "Barker", name: "Bob Barker", secondEmail: 'vanna@gmail.com', secondFirstName: "Vanna", secondLastName: "Blue", secondName: "Vanna Blue"},
  {email: 'dude@gmail.com', firstName: "Dude", lastName: "ster", name: "Dude ster", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
  {email: 'jay@gmail.com', firstName: "Jay", lastName: "Mann", name: "Jay Man", secondEmail: "dee@gmail.com", secondFirstName: "Dee", secondLastName: "Dah", secondName: "Dee Dah"},
  {email: 'albertomadueno@gmail.com', firstName: "Alberto", lastName: "Madueno", name: "Alberto Madueno", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
  {email: 'snipeboatblue@gmail.com', firstName: "Alberto", lastName: "Madueno", name: "Alberto Madueno", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
  {email: 'khaatveit@gmail.com', firstName: "Kersti", lastName: "Haatveit", name: "Kersti Haatveit", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
];

export const mockApplicants = [
  {email: 'twotester@gmail.com', firstName: "Jack", lastName: "Black", name: "Jack Black", secondEmail: 'jackwhite@gmail.com', secondFirstName: "Jacko", secondLastName: "White", secondName: "Jacko White"},
  {email: 'onetester.com', firstName: "Bob", lastName: "Barker", name: "Bob Barker", secondEmail: 'vanna@gmail.com', secondFirstName: "Vanna", secondLastName: "Blue", secondName: "Vanna Blue"},
];

export const mockVesselData = {
    beam: 15, 
    draft: 6, 
    hullMaterial: ['fiber glass', 'wood', 'concrete', 'plastic', 'aluminum'],
    img: null, 
    insuranceInfo: {
      no: '43434hfikwnf',
      company: 'farmers',
      expires: '2023-06-22'
    },
    length: 36, 
    specialNotes: 'This vessel does really exist it is a mock. Imagine it to be grand, fast and beautiful', 
    type: ['sail', 'power', 'steam', 'dingy', 'human power'], 
    vesselName: ['Gloria', 'Jolene', 'Brandy', 'Barbara Ann', 'Bobby Mcgee'],
    getRandomIndex: () => {
      return Math.floor( Math.random() * ( 1 + 4 - 0 ) ) + 0;
    }
};

export const MAKE_YC = gql`
  mutation makeYc($name: String, $region: uuid) {
  insert_yacht_clubs(objects: {name: $name, region: $region}) {
    returning {
      name
      id
      region
    }
  }
}`;

export const INSERT_MEMBER = gql`
  mutation inserMembers(
    $email: String,
    $firstName: String,
    $lastName: String,
    $name: String,
    $secondEmail: String,
    $secondFirstName: String,
    $secondLastName: String,
    $secondName: String,
    $yacht_club: uuid,
  ) {
  insert_yc_members(objects: {email: $email, firstName: $firstName, lastName: $lastName, name: $name, secondEmail: $secondEmail, secondFirstName: $secondFirstName, secondLastName: $secondLastName, secondName: $secondName, yacht_club: $yacht_club}) {
    returning {
      id
      email
      firstName
      lastName
      name
      yacht_club
      secondEmail
      secondFirstName
      secondLastName
      secondName
    }
  }
}`;

export const INSERT_COMMODORE = gql`
mutation insertCommodore($name: String, $yacht_club: uuid, $member_id: uuid) {
  insert_commodores(objects: {name: $name, yacht_club: $yacht_club, member_id: $member_id}) {
    returning {
      active
      id
      member_id
      name
      yacht_club
      yachtClubByYachtClub {
        name
      }
    }
  }
}`;

export const INSERT_VESSEL = gql`
  mutation insertVessel(
    $beam: Int, 
    $draft: Int, 
    $hullMaterial: String, 
    $img: path, 
    $insuranceInfo: jsonb, 
    $length: Int, 
    $ownerId: uuid, 
    $specialNotes: String, 
    $type: String, 
    $unafilliatedVesselId: uuid, 
    $vesselName: String
  ) {
  insert_vessels(objects: {
    beam: $beam, 
    draft: $draft, 
    hullMaterial: $hullMaterial, 
    img: $img, 
    insuranceInfo: $insuranceInfo, 
    length: $length, 
    ownerId: $ownerId, 
    specialNotes: $specialNotes, 
    type: $type, 
    unafilliatedVesselId: $unafilliatedVesselId, 
    vesselName: $vesselName
  }) {
    returning {
      vesselName
      img
    }
  }
}`;
