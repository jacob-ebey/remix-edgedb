CREATE MIGRATION m1ke45xkog5yzph4j5eamh5o7t4u7i25uw7vc72fpsupkkpaizcfqa
    ONTO initial
{
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY password -> std::str;
      CREATE REQUIRED PROPERTY username -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::Task {
      CREATE REQUIRED LINK owner -> default::User;
      CREATE REQUIRED PROPERTY completed -> std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY text -> std::str;
  };
};
