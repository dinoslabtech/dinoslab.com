---
title: "systemctl on Debian, Ubuntu, and Fedora"
description: "Start, stop, enable, and debug systemd services. The commands that matter, plus the unit-name differences between Debian and Fedora."
pubDate: 2025-11-11
updatedDate: 2026-09-08
author: "Michele Forese"
tags: ["linux", "systemctl", "systemd", "debian", "ubuntu", "fedora"]
---

Most current Linux distributions boot with **systemd**. `systemctl` is the tool you use against it: start and stop services, enable them at boot, read status, and inspect what went wrong.

The syntax is the same on Debian, Ubuntu, and Fedora. Unit *names* are not. Keep this table nearby and the rest of the page stays short.

| What | Debian / Ubuntu | Fedora |
| --- | --- | --- |
| Apache | `apache2` | `httpd` |
| OpenSSH | `ssh` | `sshd` |
| PostgreSQL | `postgresql` | `postgresql` |
| MariaDB | `mariadb` or `mysql` | `mariadb` |
| Firewall | `ufw` | `firewalld` |

Examples below use `nginx`. Swap the name from the table when the service is distro-specific.

## Everyday commands

```bash
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx      # stop, then start
sudo systemctl reload nginx       # reread config, keep the process
sudo systemctl reload-or-restart nginx
```

Prefer `reload` in production when the daemon supports it (`nginx -t` / `apache2ctl configtest` / `httpd -t` first). `restart` drops connections.

```bash
systemctl status nginx
systemctl is-active nginx         # active | inactive
systemctl is-enabled nginx        # enabled | disabled | static | masked
```

`status` prints the unit state, main PID, memory, and the last log lines. For scripts, `--quiet` turns `is-active` into an exit code:

```bash
if systemctl is-active --quiet nginx; then
  echo "nginx is running"
fi
```

## Boot: enable, disable, mask

```bash
sudo systemctl enable nginx           # start at boot
sudo systemctl enable --now nginx     # start at boot, and start now
sudo systemctl disable nginx
sudo systemctl disable --now nginx    # disable and stop
```

`static` units cannot be enabled directly; they are pulled in by another unit.

`mask` is stronger than `disable`. It points the unit at `/dev/null` so nothing can start it, not even a dependency or a manual `start`:

```bash
sudo systemctl mask cups
sudo systemctl unmask cups
```

Use mask for services that must stay off (a print stack on a headless box, for example). Use disable when you still want the option to start them by hand.

## Logs

systemd journals, not `/var/log/daemon.log`:

```bash
sudo journalctl -u nginx
sudo journalctl -u nginx -n 50
sudo journalctl -u nginx -f
sudo journalctl -u nginx --since today
sudo journalctl -u nginx --since "1 hour ago"
sudo journalctl -u nginx --since "2026-09-01" --until "2026-09-08"
```

A unit that failed at boot:

```bash
systemctl status nginx
sudo journalctl -u nginx --since "5 minutes ago"
sudo journalctl -xe
```

## Listing and dependencies

```bash
systemctl list-units --type=service
systemctl list-units --type=service --state=active
systemctl list-units --type=service --state=failed
systemctl list-units --type=service --all

systemctl list-unit-files --type=service --state=enabled

systemctl list-dependencies nginx
systemctl list-dependencies --reverse nginx
```

After editing a `.service` file:

```bash
sudo systemctl daemon-reload
sudo systemctl restart nginx
```

Without `daemon-reload`, systemd keeps the old unit in memory.

## Failed unit, in order

1. `systemctl status nginx` — state and the last error.
2. `sudo journalctl -u nginx -n 100 --no-pager` — full story.
3. `systemctl cat nginx` — the unit systemd is actually using.
4. Fix the file, then `sudo systemctl daemon-reload`.
5. Restart with the journal open:

```bash
sudo journalctl -u nginx -f
# other terminal:
sudo systemctl restart nginx
```

## Targets (runlevels)

A target is a set of units: the “runlevel”.

```bash
systemctl get-default
sudo systemctl set-default multi-user.target    # no graphical session
sudo systemctl set-default graphical.target
```

`set-default` is for the next boot. `isolate` changes the running system now:

```bash
sudo systemctl isolate multi-user.target
```

| Target | Meaning |
| --- | --- |
| `multi-user.target` | Multi-user, no GUI |
| `graphical.target` | Multi-user plus display manager |
| `rescue.target` | Single-user rescue |
| `emergency.target` | Smaller still: root shell, no mounts beyond `/` |
| `reboot.target` / `poweroff.target` | Reboot / halt |

```bash
sudo systemctl rescue
sudo systemctl emergency
sudo systemctl reboot
sudo systemctl poweroff
sudo systemctl suspend
sudo systemctl hibernate
```

## Two setups

Apache on Debian/Ubuntu:

```bash
sudo apt update
sudo apt install apache2
sudo systemctl enable --now apache2
sudo systemctl reload apache2    # after a config change; test with apache2ctl configtest
```

Apache on Fedora:

```bash
sudo dnf install httpd
sudo systemctl enable --now httpd
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

PostgreSQL on Debian/Ubuntu usually starts on install. On Fedora you initialise the cluster first:

```bash
# Debian / Ubuntu
sudo apt install postgresql postgresql-contrib
systemctl status postgresql

# Fedora
sudo dnf install postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl enable --now postgresql
```

## Boot time

```bash
systemd-analyze
systemd-analyze blame
systemd-analyze critical-chain
systemd-analyze plot > boot.svg
```

`blame` is noisy on a desktop; `critical-chain` is the one that shows what actually delayed boot.

## Timers

systemd timers replace many cron jobs:

```bash
systemctl list-timers
systemctl status logrotate.timer
sudo systemctl enable --now logrotate.timer
```

## Watchdog script

Restart nginx if it has died. Run it from cron or a timer.

```bash
#!/bin/bash
SERVICE=nginx

if ! systemctl is-active --quiet "$SERVICE"; then
  echo "$(date -Is) $SERVICE down, starting"
  sudo systemctl start "$SERVICE"
  sudo journalctl -u "$SERVICE" -n 20 --no-pager
fi
```

## Cheatsheet

```bash
sudo systemctl start|stop|restart|reload UNIT
sudo systemctl enable|disable [--now] UNIT
systemctl status|is-active|is-enabled UNIT
sudo systemctl mask|unmask UNIT
sudo systemctl daemon-reload
sudo journalctl -u UNIT [-f] [-n 50]
systemctl list-units --type=service --state=failed
systemd-analyze [blame|critical-chain]
```

Manual pages: `man systemctl`, `man systemd`, `man journalctl`. The [systemd page on the Arch Wiki](https://wiki.archlinux.org/title/systemd) is still the best long-form reference, including on Debian.
