CREATE MIGRATION m1i76g3jtuny6j3vj2yhny4mfs5llxjftmem2prgyk7glsffaazkfa
    ONTO m1hbujr7xfqh7x42yyuekqaz5p3hq4b4c57mvsviouwbgx7dhox6eq
{
  ALTER TYPE default::Task {
      CREATE REQUIRED PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
  };
};
