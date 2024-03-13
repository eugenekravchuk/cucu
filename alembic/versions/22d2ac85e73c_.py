"""empty message

Revision ID: 22d2ac85e73c
Revises: ad6a5ba199fd
Create Date: 2024-03-13 12:09:07.037008

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '22d2ac85e73c'
down_revision: Union[str, None] = 'ad6a5ba199fd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
