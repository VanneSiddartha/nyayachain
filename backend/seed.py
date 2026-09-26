from database import Base, SessionLocal, engine
from models import Case, CaseAssignment, User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DEFAULT_USERS = (
    {
        "username": "officer_ravi",
        "role": "investigating_officer",
        "full_name": "Ravi Kumar",
    },
    {
        "username": "supervisor_sharma",
        "role": "supervisory_officer",
        "full_name": "Sharma Sir",
    },
    {
        "username": "lawyer_priya",
        "role": "legal_reviewer",
        "full_name": "Priya Sharma",
    },
    {
        "username": "auditor_arun",
        "role": "auditor",
        "full_name": "Arun V",
    },
)


def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        users = {}
        for user_data in DEFAULT_USERS:
            user = (
                db.query(User)
                .filter(User.username == user_data["username"])
                .first()
            )
            if user is None:
                user = User(
                    **user_data,
                    password_hash=pwd_context.hash("password123"),
                )
                db.add(user)
                db.flush()
            users[user.username] = user

        case = (
            db.query(Case)
            .filter(Case.case_reference == "HYD-CYB-2026-0147")
            .first()
        )
        if case is None:
            case = Case(
                case_reference="HYD-CYB-2026-0147",
                title="Cyber Fraud - Bank Account Hacking",
                status="active",
            )
            db.add(case)
            db.flush()

        for username in ("officer_ravi", "supervisor_sharma"):
            user = users[username]
            assignment = (
                db.query(CaseAssignment)
                .filter(
                    CaseAssignment.case_id == case.id,
                    CaseAssignment.user_id == user.id,
                )
                .first()
            )
            if assignment is None:
                db.add(CaseAssignment(case_id=case.id, user_id=user.id))

        db.commit()
        print(
            "Database seeded successfully with default users and initial case!"
        )
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
