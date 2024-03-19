"""empty message

Revision ID: ad6a5ba199fd
Revises: 62f42c5b2369, 7d1b6ae2be2e
Create Date: 2024-03-13 12:01:43.301368

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ad6a5ba199fd'
down_revision: Union[str, None] = ('62f42c5b2369', '7d1b6ae2be2e')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
