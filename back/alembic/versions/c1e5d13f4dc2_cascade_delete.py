"""cascade_delete

Revision ID: c1e5d13f4dc2
Revises: 1b9f4d2b436a
Create Date: 2024-03-17 20:53:54.361688

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c1e5d13f4dc2'
down_revision: Union[str, None] = '1b9f4d2b436a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Followers',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('follower_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['follower_id'], ['Users.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['Users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('user_id', 'follower_id')
    )
    op.drop_table('Follows')
    op.drop_constraint('CommentLikes_user_id_fkey', 'CommentLikes', type_='foreignkey')
    op.drop_constraint('CommentLikes_comment_id_fkey', 'CommentLikes', type_='foreignkey')
    op.create_foreign_key(None, 'CommentLikes', 'Users', ['user_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key(None, 'CommentLikes', 'comments', ['comment_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint('comments_user_id_fkey', 'comments', type_='foreignkey')
    op.drop_constraint('comments_post_id_fkey', 'comments', type_='foreignkey')
    op.create_foreign_key(None, 'comments', 'Users', ['user_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key(None, 'comments', 'posts', ['post_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint('post_likes_post_id_fkey', 'post_likes', type_='foreignkey')
    op.drop_constraint('post_likes_user_id_fkey', 'post_likes', type_='foreignkey')
    op.create_foreign_key(None, 'post_likes', 'Users', ['user_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key(None, 'post_likes', 'posts', ['post_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint('posts_user_id_fkey', 'posts', type_='foreignkey')
    op.create_foreign_key(None, 'posts', 'Users', ['user_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'posts', type_='foreignkey')
    op.create_foreign_key('posts_user_id_fkey', 'posts', 'Users', ['user_id'], ['id'])
    op.drop_constraint(None, 'post_likes', type_='foreignkey')
    op.drop_constraint(None, 'post_likes', type_='foreignkey')
    op.create_foreign_key('post_likes_user_id_fkey', 'post_likes', 'Users', ['user_id'], ['id'])
    op.create_foreign_key('post_likes_post_id_fkey', 'post_likes', 'posts', ['post_id'], ['id'])
    op.drop_constraint(None, 'comments', type_='foreignkey')
    op.drop_constraint(None, 'comments', type_='foreignkey')
    op.create_foreign_key('comments_post_id_fkey', 'comments', 'posts', ['post_id'], ['id'])
    op.create_foreign_key('comments_user_id_fkey', 'comments', 'Users', ['user_id'], ['id'])
    op.drop_constraint(None, 'CommentLikes', type_='foreignkey')
    op.drop_constraint(None, 'CommentLikes', type_='foreignkey')
    op.create_foreign_key('CommentLikes_comment_id_fkey', 'CommentLikes', 'comments', ['comment_id'], ['id'])
    op.create_foreign_key('CommentLikes_user_id_fkey', 'CommentLikes', 'Users', ['user_id'], ['id'])
    op.create_table('Follows',
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('follower_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['follower_id'], ['Users.id'], name='Follows_follower_id_fkey'),
    sa.ForeignKeyConstraint(['user_id'], ['Users.id'], name='Follows_user_id_fkey')
    )
    op.drop_table('Followers')
    # ### end Alembic commands ###