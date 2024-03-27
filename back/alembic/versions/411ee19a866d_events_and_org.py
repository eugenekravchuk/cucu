"""events_and_org

Revision ID: 411ee19a866d
Revises: c1e5d13f4dc2
Create Date: 2024-03-22 01:29:16.109120

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '411ee19a866d'
down_revision: Union[str, None] = 'c1e5d13f4dc2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_Posts_id', table_name='Posts')
    op.drop_table('Posts')
    op.add_column('Events', sa.Column('event_id', sa.Integer(), nullable=False))
    op.add_column('Events', sa.Column('event_text', sa.String(), nullable=False))
    op.add_column('Events', sa.Column('event_photo', sa.String(), nullable=False))
    op.add_column('Events', sa.Column('event_time_creation', sa.DateTime(), nullable=False))
    op.add_column('Events', sa.Column('event_date', sa.Date(), nullable=False))
    op.drop_index('ix_Events_id', table_name='Events')
    op.create_index(op.f('ix_Events_event_id'), 'Events', ['event_id'], unique=False)
    op.drop_column('Events', 'id')
    op.drop_column('Events', 'time_creation')
    op.drop_column('Events', 'text')
    op.drop_column('Events', 'photo')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('Events', sa.Column('photo', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.add_column('Events', sa.Column('text', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.add_column('Events', sa.Column('time_creation', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.add_column('Events', sa.Column('id', sa.INTEGER(), server_default=sa.text('nextval(\'"Events_id_seq"\'::regclass)'), autoincrement=True, nullable=False))
    op.drop_index(op.f('ix_Events_event_id'), table_name='Events')
    op.create_index('ix_Events_id', 'Events', ['id'], unique=False)
    op.drop_column('Events', 'event_date')
    op.drop_column('Events', 'event_time_creation')
    op.drop_column('Events', 'event_photo')
    op.drop_column('Events', 'event_text')
    op.drop_column('Events', 'event_id')
    op.create_table('Posts',
    sa.Column('id', sa.INTEGER(), server_default=sa.text('nextval(\'"Posts_id_seq"\'::regclass)'), autoincrement=True, nullable=False),
    sa.Column('text', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('photo', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('date', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['Users.id'], name='Posts_user_id_fkey', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name='Posts_pkey')
    )
    op.create_index('ix_Posts_id', 'Posts', ['id'], unique=False)
    # ### end Alembic commands ###
