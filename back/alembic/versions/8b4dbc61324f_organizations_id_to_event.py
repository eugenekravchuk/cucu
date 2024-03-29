"""organizations_id to event

Revision ID: 8b4dbc61324f
Revises: f80485cd9983
Create Date: 2024-03-25 18:53:28.782929

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8b4dbc61324f'
down_revision: Union[str, None] = 'f80485cd9983'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Categories',
    sa.Column('category_id', sa.Integer(), nullable=False),
    sa.Column('category_name', sa.String(), nullable=True),
    sa.Column('category_image', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('category_id')
    )
    op.create_table('Events',
    sa.Column('event_id', sa.Integer(), nullable=False),
    sa.Column('event_text', sa.String(), nullable=False),
    sa.Column('event_photo', sa.String(), nullable=False),
    sa.Column('event_time_creation', sa.DateTime(), nullable=False),
    sa.Column('event_date', sa.Date(), nullable=False),
    sa.Column('organization_id', sa.Integer(), nullable=False),
    sa.Column('category_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['category_id'], ['Categories.category_id'], ),
    sa.ForeignKeyConstraint(['organization_id'], ['Organizations.organization_id'], ),
    sa.PrimaryKeyConstraint('event_id')
    )
    op.create_index(op.f('ix_Events_event_id'), 'Events', ['event_id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_Events_event_id'), table_name='Events')
    op.drop_table('Events')
    op.drop_table('Categories')
    # ### end Alembic commands ###
