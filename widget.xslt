<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:c="http://morfeo-project.org/2007/Template">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="c:Template">
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="c:Catalog.ResourceDescription/c:Name" /></title>
        <link href="http://netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css" rel="stylesheet"/>
        <style type="text/css">
          .container { background-color: #fff; border: 1px solid #ccc; margin-top: 1em; border-radius: 5px }
          body { background-color: #eee }
          footer { font-size: 11px }
        </style>
      </head>
      <body>
        <div class="container">
          <h2><xsl:value-of select="c:Catalog.ResourceDescription/c:DisplayName" /></h2>
          <div>(internal name: <code><xsl:value-of select="c:Catalog.ResourceDescription/c:Name"/></code>)</div>

          <div class="row">
            <div class="col-md-4">
              <fieldset>
                <legend>Metadata</legend>
                <div>
                  <strong>Maintainer: </strong>
                  <xsl:value-of select="c:Catalog.ResourceDescription/c:Author"/> (<xsl:value-of select="c:Catalog.ResourceDescription/c:Vendor"/>, <xsl:value-of select="c:Catalog.ResourceDescription/c:Mail"/>)
                </div>
                <div>
                  <strong>Version: </strong>
                  <xsl:value-of select="c:Catalog.ResourceDescription/c:Version"/>
                </div>
              </fieldset>
            </div>

            <div class="col-md-4">
              <fieldset>
                <legend>Description</legend>
                <div><xsl:value-of select="c:Catalog.ResourceDescription/c:Description"/></div>
              </fieldset>
            </div>

            <div class="col-md-4">
              <fieldset>
                <legend>Endpoints &amp; Configuration</legend>
                <xsl:if test="c:Platform.Wiring/c:InputEndpoint">
                  <div class="text-info">Incoming endpoints:</div>
                  <ul>
                    <xsl:apply-templates select="c:Platform.Wiring/c:InputEndpoint"/>
                  </ul>
                </xsl:if>

                <xsl:if test="c:Platform.Wiring/c:OutputEndpoint">
                  <div class="text-info">Outgoing endpoints:</div>
                  <ul>
                    <xsl:apply-templates select="c:Platform.Wiring/c:OutputEndpoint"/>
                  </ul>
                </xsl:if>

                <xsl:if test="c:Platform.Preferences">
                  <div class="text-info">Configuration:</div>
                  <ul>
                    <xsl:apply-templates select="c:Platform.Preferences"/>
                  </ul>
                </xsl:if>
              </fieldset>
            </div>
          </div>

          <footer class="hidden-print">
            This file was generated automatically. Do not modify it by hand.
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="c:Platform.Wiring/c:InputEndpoint|c:Platform.Wiring/c:OutputEndpoint">
    <li>
      <div><strong><xsl:value-of select="@label"/></strong>
        (<code><span title="internal name"><xsl:value-of select="@name"/></span> : <span title="declared friendcode"><xsl:value-of select="@friendcode"/></span></code>):
        <xsl:value-of select="@description"/></div>
      <xsl:if test="text()">
        <div><xsl:value-of select="text()"/></div>
      </xsl:if>
    </li>
  </xsl:template>

  <xsl:template match="c:Platform.Preferences/c:Preference">
    <li>
      <div><span><xsl:value-of select="@label"/></span>
        (<code><xsl:value-of select="@name"/></code>):
        <xsl:value-of select="@description"/></div>
      <xsl:if test="text()">
        <div><xsl:value-of select="text()"/></div>
      </xsl:if>
    </li>
  </xsl:template>
</xsl:stylesheet>
