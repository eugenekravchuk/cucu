"""Bio added

Revision ID: ae1a8ad6b66e
Revises: 370f1b3cb9f8
Create Date: 2024-03-25 03:27:02.229476

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ae1a8ad6b66e'
down_revision: Union[str, None] = '370f1b3cb9f8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('Organizations', sa.Column('organization_desc', sa.Text(), nullable=True))
    op.add_column('Users', sa.Column('bio', sa.Text(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('Users', 'bio')
    op.drop_column('Organizations', 'organization_desc')
    # ### end Alembic commands ###
