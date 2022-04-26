module default {
  type User {
    required property username -> str {
      constraint exclusive;
    };
    required property password -> str;
  }

  type Task {
    required property text -> str;
    required property completed -> bool {
      default := false;
    }
    required property createdAt -> datetime {
      default := datetime_current();
    }
    required link owner -> User {
      on target delete delete source;
    }
  }
}
