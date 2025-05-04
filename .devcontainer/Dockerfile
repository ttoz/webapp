FROM node:22-slim as node-base

RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        build-essential \
        curl \
        wget \
        sqlite3 \
        git \
        vim \
        zip \
        unzip \
        locales \
        less \
        openssh-client
RUN apt-get install --no-install-recommends -y sudo \
    && echo node ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/node \
    && chmod 0440 /etc/sudoers.d/node

RUN sed -i 's/# ja_JP.UTF-8 UTF-8/ja_JP.UTF-8 UTF-8/' /etc/locale.gen && locale-gen
ENV LANG=ja_JP.UTF-8

RUN npm install -g npm@latest
RUN npm install -g typescript ts-node vitest @types/node@22
RUN npm install -g eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
RUN npm install -g prettier eslint-config-prettier
RUN npm install -g @nestjs/cli

FROM node-base as python-node-base
RUN echo "deb http://archive.debian.org/debian/ stretch main" > /etc/apt/sources.list \
    && echo "deb http://archive.debian.org/debian-security stretch/updates main" >> /etc/apt/sources.list \
    && apt-get update \
    && apt-get install -y awscli
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUTF8=1 \
    \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    \
    POETRY_VERSION=1.1.5 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_CREATE=false
ENV PATH="$POETRY_HOME/bin:$PATH"
RUN curl -sSL https://install.python-poetry.org | python3 -
RUN chown -R node:node $POETRY_HOME


FROM python-node-base as browser-base
# COPY ./.devcontainer/.fonts.zip /opt/.fonts.zip
# RUN cd /opt && unzip .fonts.zip && rm .fonts.zip
# RUN apt-get install --no-install-recommends -y \
#          libgtk-3.0 libgbm-dev libnss3 \ 
#          libatk-bridge2.0-0 libasound2
RUN apt-get clean && rm -rf /var/lib/apt/lists/*


FROM browser-base as development
ENV POETRY_NO_INTERACTION=1
USER node


FROM development as builder-base
RUN poetry install --no-dev
RUN npm install -g --production


FROM browser-base as production
COPY --from=builder-base /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=builder-base /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY ./src /app/
WORKDIR /app
