import { gql } from "@apollo/client";
export const Club_Madueno = 'Madueno';
export const Club_Blue = 'Blue';
const Club_Haatveit = 'Haatveit';

export const mockClubs = [
  {
    clubName: Club_Madueno,
    region: 'f58dc1cc-2ddb-4e59-8599-e4136f5b1d6e',
    members: [
      {isCommodore: true, email: 'albertomadueno@gmail.com', firstName: "Alberto", lastName: "Madueno", name: "Alberto Madueno", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
      {isCommodore: false, email: 'jackblack@gmail.com', firstName: "Jack", lastName: "Black", name: "Jack Black", secondEmail: 'jackwhite@gmail.com', secondFirstName: "Jacko", secondLastName: "White", secondName: "Jacko White"},
      {isCommodore: false, email: 'bobs@gmail.com', firstName: "Bob", lastName: "Barker", name: "Bob Barker", secondEmail: 'vanna@gmail.com', secondFirstName: "Vanna", secondLastName: "Blue", secondName: "Vanna Blue"},
      {isCommodore: false, email: 'dudeman@gmail.com', firstName: "Dude", lastName: "ster", name: "Dude ster", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
      {isCommodore: false, email: 'jayo@gmail.com', firstName: "Jay", lastName: "Mann", name: "Jay Man", secondEmail: "dee@gmail.com", secondFirstName: "Dee", secondLastName: "Dah", secondName: "Dee Dah"},
      {isCommodore: false, email: 'dingdong@gmail.com', firstName: "Alberto", lastName: "Madueno", name: "Alberto Madueno", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
      // {isCommodore: false, email: 'twotester@gmail.com', firstName: "Jack", lastName: "Black", name: "Jack Black", secondEmail: 'jackwhite@gmail.com', secondFirstName: "Jacko", secondLastName: "White", secondName: "Jacko White"},
      // {isCommodore: false, email: 'onetester.com', firstName: "Bob", lastName: "Barker", name: "Bob Barker", secondEmail: 'vanna@gmail.com', secondFirstName: "Vanna", secondLastName: "Blue", secondName: "Vanna Blue"},
    ],
    applicants: [
      {email: 'jackblack1@gmail.com', firstName: "Jack", lastName: "Black", name: "Jack Black", secondEmail: 'jackwhite@gmail.com', secondFirstName: "Jacko", secondLastName: "White", secondName: "Jacko White"},
      {email: 'bobs@gmail1.com', firstName: "Bob", lastName: "Barker", name: "Bob Barker", secondEmail: 'vanna@gmail.com', secondFirstName: "Vanna", secondLastName: "Blue", secondName: "Vanna Blue"},
      {email: 'dudeman1@gmail.com', firstName: "Dude", lastName: "ster", name: "Dude ster", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
      {email: 'jayo1@gmail.com', firstName: "Jay", lastName: "Mann", name: "Jay Man", secondEmail: "dee@gmail.com", secondFirstName: "Dee", secondLastName: "Dah", secondName: "Dee Dah"},
      {email: 'dingdong1@gmail.com', firstName: "Alberto", lastName: "Madueno", name: "Alberto Madueno", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
    ]
  },
  {
    clubName: Club_Haatveit,
    region: 'f58dc1cc-2ddb-4e59-8599-e4136f5b1d6e',
    members: [
      {isCommodore: true, email: 'khaatveit@gmail.com', firstName: "Kersti", lastName: "Haatveit", name: "Kersti Haatveit", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
      {isCommodore: false, email: 'john@gmail.com', firstName: "Alberto", lastName: "Madueno", name: "Alberto Madueno", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
      {isCommodore: false, email: 'jackoboblack@gmail.com', firstName: "Jack", lastName: "Black", name: "Jack Black", secondEmail: 'jackwhite@gmail.com', secondFirstName: "Jacko", secondLastName: "White", secondName: "Jacko White"},
      {isCommodore: false, email: 'jingleheimer@gmail.com', firstName: "Bob", lastName: "Barker", name: "Bob Barker", secondEmail: 'vanna@gmail.com', secondFirstName: "Vanna", secondLastName: "Blue", secondName: "Vanna Blue"},
      {isCommodore: false, email: 'smith@gmail.com', firstName: "Dude", lastName: "ster", name: "Dude ster", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
      {isCommodore: false, email: 'jayngles@gmail.com', firstName: "Jay", lastName: "Mann", name: "Jay Man", secondEmail: "dee@gmail.com", secondFirstName: "Dee", secondLastName: "Dah", secondName: "Dee Dah"},
      {isCommodore: false, email: 'ojngoboingo@gmail.com', firstName: "Alberto", lastName: "Madueno", name: "Alberto Madueno", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
    ],
    applicants: [
      {email: 'jackblack@gmail2app.com', firstName: "Jack", lastName: "Black", name: "Jack Black", secondEmail: 'jackwhite@gmail.com', secondFirstName: "Jacko", secondLastName: "White", secondName: "Jacko White"},
      {email: 'bobs@gmail2app.com', firstName: "Bob", lastName: "Barker", name: "Bob Barker", secondEmail: 'vanna@gmail.com', secondFirstName: "Vanna", secondLastName: "Blue", secondName: "Vanna Blue"},
      {email: 'dudeman@gmailapp.com', firstName: "Dude", lastName: "ster", name: "Dude ster", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
      {email: 'jayo@gmailapp.com', firstName: "Jay", lastName: "Mann", name: "Jay Man", secondEmail: "dee@gmail.com", secondFirstName: "Dee", secondLastName: "Dah", secondName: "Dee Dah"},
      {email: 'dingdong@gmailapp.com', firstName: "Alberto", lastName: "Madueno", name: "Alberto Madueno", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
    ]
  },
  {
    clubName: Club_Blue,
    region: 'f58dc1cc-2ddb-4e59-8599-e4136f5b1d6e',
    members: [
      {isCommodore: true, email: 'snipeboatblue@gmail.com', firstName: "Alberto", lastName: "Madueno", name: "Alberto Madueno", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
      {isCommodore: false, email: 'johnatshan@gmail.com', firstName: "Alberto", lastName: "Madueno", name: "Alberto Madueno", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
      {isCommodore: false, email: 'jackhrungary@gmail.com', firstName: "Jack", lastName: "Black", name: "Jack Black", secondEmail: 'jackwhite@gmail.com', secondFirstName: "Jacko", secondLastName: "White", secondName: "Jacko White"},
      {isCommodore: false, email: 'singsong@gmail.com', firstName: "Bob", lastName: "Barker", name: "Bob Barker", secondEmail: 'vanna@gmail.com', secondFirstName: "Vanna", secondLastName: "Blue", secondName: "Vanna Blue"},
      {isCommodore: false, email: 'wierdoman.com', firstName: "Dude", lastName: "ster", name: "Dude ster", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
      {isCommodore: false, email: 'jayngdlesopi@gmail.com', firstName: "Jay", lastName: "Mann", name: "Jay Man", secondEmail: "dee@gmail.com", secondFirstName: "Dee", secondLastName: "Dah", secondName: "Dee Dah"},
      {isCommodore: false, email: 'ingobanger@gmail.com', firstName: "Alberto", lastName: "Madueno", name: "Alberto Madueno", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
    ],
    applicants: [
      {email: 'jackblack@gmail3app2.com', firstName: "Jack", lastName: "Black", name: "Jack Black", secondEmail: 'jackwhite@gmail.com', secondFirstName: "Jacko", secondLastName: "White", secondName: "Jacko White"},
      {email: 'bobs@gmail2app3.com', firstName: "Bob", lastName: "Barker", name: "Bob Barker", secondEmail: 'vanna@gmail.com', secondFirstName: "Vanna", secondLastName: "Blue", secondName: "Vanna Blue"},
      {email: 'dudeman@gmailapp3.com', firstName: "Dude", lastName: "ster", name: "Dude ster", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
      {email: 'jayo@gmailapp3.com', firstName: "Jay", lastName: "Mann", name: "Jay Man", secondEmail: "dee@gmail.com", secondFirstName: "Dee", secondLastName: "Dah", secondName: "Dee Dah"},
      {email: 'dingdong@gmailapp3.com', firstName: "Alberto", lastName: "Madueno", name: "Alberto Madueno", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
    ]
  },
]

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
      unafilliatedVesselId
      id
      beam
      draft
      hullMaterial
      img
      insuranceInfo
      length
      ownerId
      specialNotes
      type
      vesselName
    }
  }
}`;

export const INSERT_MEMBER_APPLICANT = gql`
mutation insertPotentialMembers(
  $email: String,
  $firstName: String,
  $lastName: String,
  $secondEmail: String,
  $secondFirstName: String,
  $secondLastName: String,
  $yacht_club: uuid,
  $referredBy: String,
) {
insert_potential_members(objects: {
  email: $email,
  firstName: $firstName,
  lastName: $lastName,
  secondEmail: $secondEmail,
  secondFirstName: $secondFirstName,
  secondLastName: $secondLastName,
  yacht_club: $yacht_club,
  referredBy: $referredBy
}) {
  affected_rows
}
}`;
