if which bullet >/dev/null; then
    bullet="$(bullet)"
else
    bullet=٭
fi

_force_colors=

force_colors() {
    _force_colors=yes
}

brackl() {
    printf "〈" # 3008
}

brackr() {
    printf "〉" # 3009
}

color() {
    c=$1
    shift

    doit=yes

    if [ -n "$force_colors" ]; then
        doit=yes
    fi

    # --- difficult to make it work right for printf.
    if [ "$doit" = 'yes' ]; then
        echo -n [${c}m"${@}"[0m
    else
        echo -n "$@"
    fi
}

green() {
    color 32 "$@"
}
bright-green() {
    color 92 "$@"
}
yellow() {
    color 33 "$@"
}
bright-yellow() {
    color 93 "$@"
}
red() {
    color 31 "$@"
}
bright-red() {
    color 91 "$@"
}
blue() {
    color 34 "$@"
}
bright-blue() {
    color 94 "$@"
}
magenta() {
    color 35 "$@"
}
bright-magenta() {
    color 95 "$@"
}
cyan() {
    color 36 "$@"
}
bright-cyan() {
    color 96 "$@"
}

doit() {
    echo "$@"
    "$@"
}

shell-quote() {
    for i in "$@"; do
        # --- ] has to be the first thing in the list.
        if [[ "$i" =~ [][:space:]\;\$\!\&\*\(\)\{\[\}\<\>\?\~\`\'\"] ]] ; then
            # --- if it contains a special char or a space, do the quoting.
            #
            # simple algorithm: substitute every single quote with single
            # quote + backslash + single quote + single quote, then surround
            # the entire thing with single quotes.
            #
            # regex preceded by / to mean global.
            #
            # (yes really).
            printf -- "%s%s%s " \' "${i//\'/\'\\\'\'}"  \'
        else
            printf -- "$i "
        fi
    done
}

cmd() {
    green "$bullet "
    printf "%s\n" "$(shell-quote "$@")"
    "$@"
}

cmd_eval() {
    green "$bullet "
    echo "$@"
    eval "$@"
}

# --- expects arrayname to be simple word (doesn't quote).
push() {
    name=$1
    eval "$name=(\"\${$name[@]}\" \"$2\")"
}

assert_arg() {
    var=$1
    if [ -z "$var" ]; then
        echo "error assert_arg"
        exit 1
    fi
    eval "val=\$$var"
    if [ -z "$val" ]; then
        if [ -n "$USAGE" ]; then
            echo $USAGE
        fi
        exit 1
    fi
}

info() {
    bright-blue "$bullet "
    if [ "$1" = '-n' ]; then
        shift
        echo -n "$@"
    else
        echo "$@"
    fi
}

error() {
    printf >&2 "%s Error: %s\n" $(red "$bullet") "$*"
    exit 1
}
 
warn() {
    printf >&2 "%s %s\n" $(bright-red "$bullet") "$*"
}

infof() {
    local e
    local one="$1"
    shift
    printf -v e "$one" "$@"
    info "$e"
}

errorf() {
    local e
    local one="$1"
    shift
    printf -v e "$one" "$@"
    error "$e"
}

warnf() {
    local e
    local one="$1"
    shift
    printf -v e "$one" "$@"
    warn "$e"
}

press_enter() {
    perl -e "print 'Press enter to continue. '; <STDIN>"
}

waitfor() {
    local proc
    for proc in "$@"; do
        while ! quiet ps -C "$proc"; do
            printf "Still waiting for %s\n" $(yellow "$proc")
            sleep 1
        done
    done
}

# --- dies.
chd() {
    dir="$1"
    if [ ! -e "$dir" ]; then
        errorf "Dir %s doesn't exist" "$(red "$dir")"
    fi
    cd "$dir"
    infof "Chdir %s" "$(green "$dir")"
    if [ $? != 0 ]; then
        errorf "Couldn't cd to dir %s" "$(red "$dir")"
    fi
}
