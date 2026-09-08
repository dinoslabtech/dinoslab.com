---

title: "Complete Guide to systemctl: Managing Services on Linux"

description: "A practical guide to mastering systemctl on Linux, with examples for Debian, Ubuntu, and Fedora"

pubDate: 2025-11-11

author: "Michele Forese"

tags: ["linux", "systemctl", "systemd", "administration", "debian", "ubuntu", "fedora"]

---

# Complete Guide to systemctl: Managing Services on Linux

`systemctl` is the primary command-line tool for managing services on Linux systems that use **systemd**. It allows you to start, stop, restart, inspect, configure, and troubleshoot services, as well as manage other systemd units such as targets, mount points, and timers.

This guide provides a practical overview of `systemctl`, from basic service management to advanced troubleshooting and system administration tasks.

## Introduction to systemd and systemctl

**systemd** is the init system and service manager used by most modern Linux distributions. It is responsible for initializing the system during boot and managing services and other system resources throughout the system's lifetime.

`systemctl` is the primary interface for interacting with systemd from the command line.

Although this guide focuses on services, systemd can manage many different types of units, including:

* Services (`.service`)
* Sockets (`.socket`)
* Timers (`.timer`)
* Mount points (`.mount`)
* Automount points (`.automount`)
* Targets (`.target`)
* Devices (`.device`)
* Paths (`.path`)
* Slices (`.slice`)
* Scopes (`.scope`)

### Compatibility

The commands and concepts covered in this guide are applicable to modern releases of:

* Debian 10+ (Buster and later)
* Ubuntu 18.04+ (Bionic Beaver and later)
* Fedora 30+ and later

The exact service names and package-management commands may differ between distributions.

---

# Basic Service Management

## Starting a Service

To start a service immediately:

```bash
# Debian/Ubuntu/Fedora
sudo systemctl start service-name
```

For example, to start Apache:

```bash
# Debian/Ubuntu
sudo systemctl start apache2

# Fedora
sudo systemctl start httpd
```

Starting a service does **not** automatically configure it to start at boot. If you also want it to start automatically after reboot, use:

```bash
sudo systemctl enable service-name
```

Or combine both operations:

```bash
sudo systemctl enable --now service-name
```

---

## Stopping a Service

To stop a running service:

```bash
# Debian/Ubuntu/Fedora
sudo systemctl stop service-name
```

Examples:

```bash
# Debian/Ubuntu
sudo systemctl stop apache2

# Fedora
sudo systemctl stop httpd

# SSH service
sudo systemctl stop ssh
```

On Fedora, the SSH service is commonly named `sshd`:

```bash
sudo systemctl stop sshd
```

Be careful when stopping services remotely. Stopping an SSH service on a remote server can disconnect you from the machine.

---

## Restarting a Service

Restarting a service stops it and starts it again:

```bash
sudo systemctl restart service-name
```

Examples:

```bash
# Restart PostgreSQL
sudo systemctl restart postgresql

# Debian/Ubuntu
sudo systemctl restart mysql

# Fedora, when using MariaDB
sudo systemctl restart mariadb
```

A restart is useful when a service has entered an unexpected state or when a configuration change requires a full restart.

---

## Reloading a Service Configuration

Some services can reload their configuration without completely stopping. This is generally preferable for production services because existing connections may remain active.

```bash
sudo systemctl reload service-name
```

For example:

```bash
sudo systemctl reload nginx
```

Whether `reload` is supported depends on the service's systemd unit.

---

## Reload or Restart

If you want to reload the configuration when possible, but restart the service when reloading is not supported:

```bash
sudo systemctl reload-or-restart service-name
```

This is useful when you want the least disruptive operation that will still apply the new configuration.

---

# Managing Services at Boot

## Enabling a Service

To configure a service to start automatically during boot:

```bash
sudo systemctl enable service-name
```

Examples:

```bash
# Enable Docker
sudo systemctl enable docker

# Enable PostgreSQL
sudo systemctl enable postgresql
```

To enable and start the service immediately:

```bash
sudo systemctl enable --now service-name
```

This is one of the most commonly useful forms of `systemctl enable`.

---

## Disabling a Service

To prevent a service from starting automatically during boot:

```bash
sudo systemctl disable service-name
```

Examples:

```bash
# Debian/Ubuntu
sudo systemctl disable apache2

# Fedora
sudo systemctl disable httpd
```

To disable the service and stop it immediately:

```bash
sudo systemctl disable --now service-name
```

This is useful when you no longer want a service running at all.

---

## Checking Whether a Service Is Enabled

Use:

```bash
systemctl is-enabled service-name
```

Typical results include:

| Result     | Meaning                                                                       |
| ---------- | ----------------------------------------------------------------------------- |
| `enabled`  | The unit is configured to start automatically                                 |
| `disabled` | The unit is not configured to start automatically                             |
| `static`   | The unit cannot be enabled directly and is normally activated as a dependency |
| `masked`   | The unit has been completely prevented from starting                          |

---

# Monitoring and Troubleshooting

## Checking the Status of a Service

The most useful command when troubleshooting a service is:

```bash
systemctl status service-name
```

For example:

```bash
# Debian/Ubuntu
systemctl status ssh

# Fedora
systemctl status sshd
```

The output typically contains information such as:

* Whether the service is running
* Whether it has failed
* The main process PID
* How long the service has been running
* Recent log messages
* The service's startup command
* The location of its unit file

For a more compact status check, you can use:

```bash
systemctl is-active service-name
```

---

## Checking Whether a Service Is Active

```bash
systemctl is-active service-name
```

The command normally returns `active` or `inactive`.

It is particularly useful in scripts because it can be used as a condition:

```bash
if systemctl is-active --quiet service-name; then
    echo "The service is running"
fi
```

---

## Viewing Service Logs

Systemd uses the **journald** logging system. The `journalctl` command is used to inspect these logs.

To view all available logs for a service:

```bash
sudo journalctl -u service-name
```

### Show the Last 50 Entries

```bash
sudo journalctl -u service-name -n 50
```

### Follow Logs in Real Time

```bash
sudo journalctl -u service-name -f
```

This is particularly useful while restarting or testing a service.

### Show Logs from Today

```bash
sudo journalctl -u service-name --since today
```

### Show Logs from the Last Hour

```bash
sudo journalctl -u service-name --since "1 hour ago"
```

### Show Logs Between Two Dates

```bash
sudo journalctl -u service-name \
    --since "2025-11-01" \
    --until "2025-11-11"
```

You can also combine `journalctl` options. For example:

```bash
sudo journalctl -u nginx --since "30 minutes ago" -n 100
```

---

## Troubleshooting a Failed Service

When a service fails to start, a useful first step is to inspect both its status and its logs:

```bash
systemctl status service-name
```

Then inspect the service-specific journal:

```bash
sudo journalctl -u service-name --since "5 minutes ago"
```

For a broader view of system errors:

```bash
sudo journalctl -xe
```

When possible, start with the service-specific logs because they usually contain more relevant information.

---

# Advanced systemctl Commands

## Masking a Service

Masking a service is stronger than disabling it. A masked service cannot normally be started manually, automatically, or as a dependency.

To mask a service:

```bash
sudo systemctl mask service-name
```

To undo the mask:

```bash
sudo systemctl unmask service-name
```

For example, if a system does not use printing and you want to prevent CUPS from being started:

```bash
sudo systemctl mask cups
```

Be careful with `mask`: because it completely prevents the unit from starting, it should generally only be used when you intentionally want to block a service.

---

## Listing Services

To list currently loaded service units:

```bash
systemctl list-units --type=service
```

Only active services:

```bash
systemctl list-units --type=service --state=active
```

Only failed services:

```bash
systemctl list-units --type=service --state=failed
```

All loaded services, including inactive ones:

```bash
systemctl list-units --type=service --all
```

A particularly useful command for troubleshooting is:

```bash
systemctl --failed
```

This provides a quick overview of failed units.

---

## Listing Enabled Services

To list service unit files that are configured to start automatically:

```bash
systemctl list-unit-files --type=service --state=enabled
```

This is different from `list-units`: it shows the installed unit files and their enablement state rather than only currently loaded units.

---

## Inspecting Dependencies

To view the dependencies of a service:

```bash
systemctl list-dependencies service-name
```

For example:

```bash
systemctl list-dependencies nginx
```

To see which units depend on the specified service:

```bash
systemctl list-dependencies --reverse service-name
```

This can be very useful when troubleshooting why a service starts, stops, or gets pulled in automatically.

---

## Inspecting a Unit File

To display the systemd unit file associated with a service:

```bash
systemctl cat service-name
```

For example:

```bash
systemctl cat nginx
```

This shows the unit file as well as any drop-in configuration files.

You can also inspect a unit's properties with:

```bash
systemctl show service-name
```

Unlike `systemctl status`, `systemctl show` presents the unit's properties in a machine-readable `key=value` format, which is useful for scripting.

---

## Reloading systemd Configuration

If you create or modify a `.service` unit file, systemd needs to reload its unit-file configuration before it can see the changes:

```bash
sudo systemctl daemon-reload
```

For example:

```bash
sudo systemctl daemon-reload
sudo systemctl restart my-service
```

`daemon-reload` does **not** restart services. It only tells systemd to re-read its unit files.

---

# Rescue and Emergency Modes

systemd provides special targets for recovering a system.

To enter rescue mode:

```bash
sudo systemctl rescue
```

To enter emergency mode:

```bash
sudo systemctl emergency
```

### Rescue Mode

Rescue mode provides a minimal environment intended for system maintenance and troubleshooting.

### Emergency Mode

Emergency mode is even more minimal and is intended for situations where normal system initialization cannot continue.

These commands can interrupt running services and users, so they should be used carefully, especially on remote systems.

---

# Managing systemd Targets

A **target** is a systemd unit used to group other units and represent a particular system state.

Targets are conceptually similar to traditional runlevels, although systemd's dependency model is more flexible.

## Checking the Default Target

To see the target used by default during boot:

```bash
systemctl get-default
```

Typical results include:

```text
graphical.target
```

or:

```text
multi-user.target
```

---

## Changing the Default Target

To configure the system to boot into a text-based multi-user environment:

```bash
sudo systemctl set-default multi-user.target
```

To boot into the graphical environment by default:

```bash
sudo systemctl set-default graphical.target
```

Changing the default target affects future boots.

---

## Changing the Target Immediately

To switch to a multi-user environment immediately:

```bash
sudo systemctl isolate multi-user.target
```

To switch to the graphical target:

```bash
sudo systemctl isolate graphical.target
```

`isolate` can stop units that are not part of the new target, so use it carefully.

---

## Common Targets

| Target              | Purpose                                       |
| ------------------- | --------------------------------------------- |
| `poweroff.target`   | System shutdown                               |
| `rescue.target`     | Minimal recovery environment                  |
| `multi-user.target` | Multi-user system without a graphical desktop |
| `graphical.target`  | Multi-user system with graphical environment  |
| `reboot.target`     | System reboot                                 |

---

# System Operations

systemd can also be used to perform several system-level operations.

## Rebooting the System

```bash
sudo systemctl reboot
```

## Shutting Down the System

```bash
sudo systemctl poweroff
```

## Suspending the System

```bash
sudo systemctl suspend
```

## Hibernating the System

```bash
sudo systemctl hibernate
```

## Hybrid Sleep

```bash
sudo systemctl hybrid-sleep
```

Whether hibernation or hybrid sleep works correctly depends on the system's hardware, kernel configuration, swap configuration, and desktop environment.

---

# Practical Use Cases

## Setting Up a Web Server with Apache

### Debian/Ubuntu

Install Apache:

```bash
sudo apt update
sudo apt install apache2
```

Enable and start it:

```bash
sudo systemctl enable --now apache2
```

Check its status:

```bash
systemctl status apache2
```

After changing its configuration, test the configuration before applying it:

```bash
sudo apache2ctl configtest
```

Then reload Apache:

```bash
sudo systemctl reload apache2
```

---

### Fedora

Install Apache:

```bash
sudo dnf install httpd
```

Enable and start it:

```bash
sudo systemctl enable --now httpd
```

Check its status:

```bash
systemctl status httpd
```

If the firewall is enabled, allow HTTP traffic:

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

---

# Setting Up PostgreSQL

## Debian/Ubuntu

Install PostgreSQL:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

Check the service:

```bash
systemctl status postgresql
```

Restart it when necessary:

```bash
sudo systemctl restart postgresql
```

View recent logs:

```bash
sudo journalctl -u postgresql -n 50
```

---

## Fedora

Install PostgreSQL:

```bash
sudo dnf install postgresql-server postgresql-contrib
```

Initialize the database:

```bash
sudo postgresql-setup --initdb
```

Enable and start the service:

```bash
sudo systemctl enable --now postgresql
```

Check its status:

```bash
systemctl status postgresql
```

The exact initialization command can vary between Fedora releases and PostgreSQL packaging, so consult the package's documentation if `postgresql-setup` is unavailable.

---

# Troubleshooting a Failed Service

A systematic troubleshooting process is usually much more effective than repeatedly restarting the service.

## 1. Check the Service Status

```bash
systemctl status service-name
```

Look for:

* `failed`
* Exit codes
* Recent error messages
* Failed dependencies
* Configuration errors

## 2. Inspect the Logs

```bash
sudo journalctl -u service-name -n 100 --no-pager
```

For live troubleshooting:

```bash
sudo journalctl -u service-name -f
```

## 3. Inspect the Unit Configuration

```bash
systemctl cat service-name
```

You can also inspect all unit properties:

```bash
systemctl show service-name
```

## 4. Reload systemd if the Unit File Was Modified

```bash
sudo systemctl daemon-reload
```

## 5. Restart the Service

```bash
sudo systemctl restart service-name
```

Then immediately inspect its status and logs again:

```bash
systemctl status service-name
sudo journalctl -u service-name -n 100 --no-pager
```

---

# Creating a Timer for Scheduled Tasks

systemd timers provide a modern alternative to cron for many scheduled tasks.

To list active timers:

```bash
systemctl list-timers
```

To include inactive timers:

```bash
systemctl list-timers --all
```

To inspect a specific timer:

```bash
systemctl status service.timer
```

To enable and start a timer:

```bash
sudo systemctl enable --now service.timer
```

A timer normally activates a corresponding `.service` unit.

For example:

```text
backup.service
backup.timer
```

The timer determines **when** the task runs, while the service defines **what** actually runs.

---

# Boot Performance Analysis

systemd includes several tools for analyzing system startup.

## Overall Boot Time

```bash
systemd-analyze
```

This provides a high-level summary of how long the system took to boot.

---

## Time Spent by Individual Services

```bash
systemd-analyze blame
```

This lists units according to the time they took during startup.

Keep in mind that `blame` shows startup time for individual units and should not automatically be interpreted as proof that a unit is the sole cause of slow boot times.

---

## Boot Process Graph

You can generate an SVG representation of the boot process:

```bash
systemd-analyze plot > boot.svg
```

Open the resulting file in a web browser to inspect the boot sequence visually.

---

## Critical Boot Chain

To inspect the chain of units that contributed to the critical path during startup:

```bash
systemd-analyze critical-chain
```

You can also inspect the critical chain for a specific target or unit:

```bash
systemd-analyze critical-chain graphical.target
```

This is often more useful than `systemd-analyze blame` when investigating why boot takes longer than expected.

---

# Best Practices

## Validate Configuration Before Restarting

Whenever possible, test a service's configuration before reloading or restarting it.

For Nginx:

```bash
sudo nginx -t
```

For Apache on Debian/Ubuntu:

```bash
sudo apache2ctl configtest
```

For Apache on Fedora:

```bash
sudo httpd -t
```

If the configuration is valid, prefer a reload when possible:

```bash
sudo systemctl reload service-name
```

This minimizes downtime and avoids unnecessarily terminating active processes.

---

## Monitor Logs During Changes

When troubleshooting a service, it is often useful to monitor its logs in one terminal while performing operations in another.

### Terminal 1

```bash
sudo journalctl -u service-name -f
```

### Terminal 2

```bash
sudo systemctl restart service-name
```

This lets you immediately see errors generated during startup.

---

## Use `--no-pager` in Scripts and Diagnostics

When you want command output to be consumed directly or copied into a bug report:

```bash
systemctl status service-name --no-pager
```

Similarly:

```bash
sudo journalctl -u service-name -n 100 --no-pager
```

This prevents commands from opening an interactive pager.

---

# Automating Service Recovery

A simple Bash script can check whether a service is running and start it if necessary:

```bash
#!/bin/bash

SERVICE="nginx"

if ! systemctl is-active --quiet "$SERVICE"; then
    echo "$(date): $SERVICE is not active, starting it..."
    sudo systemctl start "$SERVICE"
    sudo journalctl -u "$SERVICE" -n 20 --no-pager
fi
```

For production systems, however, it is usually better to use systemd's own restart and recovery mechanisms instead of writing an external monitoring script.

For example, a service unit can use directives such as:

```ini
[Service]
Restart=on-failure
RestartSec=5
```

This allows systemd itself to automatically restart the service after failures.

---

# Distribution Differences

The systemd commands themselves are largely consistent across distributions, but service names and surrounding tools can differ.

| Service/Component | Debian/Ubuntu                                               | Fedora         |
| ----------------- | ----------------------------------------------------------- | -------------- |
| Apache            | `apache2`                                                   | `httpd`        |
| SSH               | `ssh`                                                       | `sshd`         |
| Networking        | `systemd-networkd` / NetworkManager / distribution-specific | NetworkManager |
| Firewall          | UFW                                                         | firewalld      |

The important distinction is that `systemctl` manages the systemd unit name, which is not necessarily the same as the package or application name.

When unsure about the exact service name, you can search the installed unit files:

```bash
systemctl list-unit-files --type=service
```

You can also use:

```bash
systemctl list-units --type=service --all
```

---

# Quick Reference

## Service Management

```bash
sudo systemctl start service       # Start
sudo systemctl stop service        # Stop
sudo systemctl restart service     # Restart
sudo systemctl reload service      # Reload configuration
sudo systemctl status service      # Show status
```

## Boot Configuration

```bash
sudo systemctl enable service      # Enable at boot
sudo systemctl disable service     # Disable at boot
sudo systemctl enable --now service
                                    # Enable and start
sudo systemctl disable --now service
                                    # Disable and stop

systemctl is-enabled service       # Check enablement
```

## Monitoring

```bash
systemctl status service
systemctl is-active service
sudo journalctl -u service
sudo journalctl -u service -f
systemctl --failed
```

## Unit Management

```bash
systemctl cat service              # Show unit file
systemctl show service             # Show unit properties
systemctl list-dependencies service
systemctl list-dependencies --reverse service

sudo systemctl daemon-reload       # Reload unit files
```

## System Operations

```bash
sudo systemctl reboot
sudo systemctl poweroff
sudo systemctl suspend
sudo systemctl hibernate
```

## Targets

```bash
systemctl get-default
sudo systemctl set-default graphical.target
sudo systemctl set-default multi-user.target

sudo systemctl isolate graphical.target
sudo systemctl isolate multi-user.target
```

## Performance Analysis

```bash
systemd-analyze
systemd-analyze blame
systemd-analyze critical-chain
systemd-analyze plot > boot.svg
```

---

# Conclusion

`systemctl` is one of the most important tools for administering modern Linux systems that use systemd. Its consistent interface makes it possible to manage services, inspect their state, troubleshoot failures, configure startup behavior, and control system targets.

The most important commands to remember are:

```bash
systemctl status service
sudo systemctl start service
sudo systemctl stop service
sudo systemctl restart service
sudo systemctl enable --now service
sudo systemctl disable --now service
sudo journalctl -u service
```

Once these commands become familiar, more advanced functionality such as dependencies, timers, targets, unit files, and boot analysis becomes significantly easier to understand.

A good troubleshooting workflow is generally:

1. Check `systemctl status`.
2. Inspect the service's `journalctl` logs.
3. Inspect the unit configuration with `systemctl cat` or `systemctl show`.
4. Validate the application's configuration if applicable.
5. Run `daemon-reload` if the unit file was changed.
6. Restart or reload the service.
7. Monitor the logs while testing the service again.

Understanding this workflow is more valuable than memorizing individual commands because it provides a repeatable method for diagnosing most systemd service problems.

---

# Additional Resources

For detailed information directly from your system:

```bash
man systemctl
man systemd
man journalctl
man systemd.service
man systemd.timer
```

The Arch Linux Wiki also provides an excellent general reference for systemd:

[Arch Wiki — systemd](https://wiki.archlinux.org/title/systemd)

---

**Last revised: September 8, 2026**
