CREATE MIGRATION m1hbujr7xfqh7x42yyuekqaz5p3hq4b4c57mvsviouwbgx7dhox6eq
    ONTO m1ke45xkog5yzph4j5eamh5o7t4u7i25uw7vc72fpsupkkpaizcfqa
{
  ALTER TYPE default::Task {
      ALTER LINK owner {
          ON TARGET DELETE  DELETE SOURCE;
      };
  };
};
