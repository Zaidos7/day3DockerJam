FROM debian:stable

RUN apt-get update && apt-get install -y \
    chromium \
    ca-certificates \
    && useradd -m zaid \
    && mkdir -p /home/zaid/.config/chromium \
    && chown -R zaid:zaid /home/zaid

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER zaid
ENV HOME=/home/zaid

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["chromium", "--headless", "--disable-gpu", "--no-sandbox"]
