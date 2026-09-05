# Roles

Cap: 300 words. One block per role, mapped to the Better Auth roles owner, admin and member. Say what each can do in verbs.

## Owner

Everything, including deleting the organisation and changing who pays.

## Admin

Everything except that. Invites and removes people, changes settings.

## Member

The daily work. Say exactly which records they can create, edit and delete.

## The outside

What a person with no account can do. Usually one public form, always guarded.

## How this is enforced

Better Auth checks organisation roles in its own endpoints. Application code checks `session.user` and the member role in server actions before calling the scoped layer. Name the helper once it exists.
