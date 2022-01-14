module.exports = {
    name: "roleUpdate",

    async execute(client, oldRole, newRole) {
        const commands = await client.application.commands.fetch();

        const { roles, id } = (oldRole.guild.cache || newRole.guild.cache)?.values();

        if (!roles) return;

        const fullPermissions = [];
        for (const command of commands.values()) {
            const { permissions: perms } = await client.commands.get(command.name);

            if (!perms) continue;

            let permissions = [];
            for (const perm of perms) {
                const role = roles.cache.find((role) => role.name === perm)?.id || roles.cache.get(perm);
                if (!role) continue;
                permissions.push(
                    {
                        id: role,
                        type: 1,
                        permission: true
                    }
                );

                fullPermissions.push({ id: command.id, permissions });
            }
        }

        await client.REST.put(
            Routes.guildApplicationCommandsPermissions(client.id, id),
            {
                body: fullPermissions
            },
        );
    }
};
