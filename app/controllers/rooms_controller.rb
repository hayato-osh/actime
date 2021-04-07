class RoomsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user, only: [:edit, :update]
  before_action :following_user, only: [:new, :create, :edit, :update]

  def new
    @room = Room.new
  end

  def create
    @room = Room.create(room_params)
    if @room.save
      redirect_to room_messages_path(@room.public_uid)
    else
      render :new
    end
  end

  def edit
    @users_in_this_room = @room.users
    @follow_users = @users.where.not(id: @users_in_this_room.ids)
    @room = Room.find_by(public_uid: params[:id])
  end
  
  def update
    @users_in_this_room = @room.users
    @follow_users = @users.where.not(id: @users_in_this_room.ids)
    if @room.update(room_params)
      redirect_to room_messages_path(@room.public_uid)
    else
      render :edit
    end
  end

  def destroy
    room = Room.find_by(public_uid: params[:id])
    if room.destroy
      redirect_to rooms_path
    end
  end

  private
  
  def room_params
    params.require(:room).permit(:thread_name, :public_uid, user_ids: [])
  end

  def set_user
    @room = Room.find_by(public_uid: params[:id])
  end

  def following_user
    followings = User.find(current_user.id).following_ids
    @users = User.where(id: followings)
  end
end
